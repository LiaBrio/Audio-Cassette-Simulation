import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// 单线程版 core（ESM 构建，供 module worker 动态 import），
// 无需 SharedArrayBuffer / COOP+COEP 头，兼容 Vercel 与 Cloudflare Pages
const CORE_VERSION = '0.12.6'
// core 的 wasm 约 31 MB，超出 Cloudflare Pages 单文件上限，无法自托管，只能走 CDN；
// 依次回退多个镜像，最后一个对中国大陆网络更友好
const CORE_BASES = [
  `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`,
  `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`,
  `https://fastly.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`,
  `https://gcore.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`,
  `https://registry.npmmirror.com/@ffmpeg/core/${CORE_VERSION}/files/dist/esm`,
]

const ACCEPTED_EXT = ['mp3', 'ogg', 'm4a', 'aac']
/** 保留最近的 core 日志，转换失败时用于还原真实原因 */
const LOG_BUFFER_SIZE = 60

let ffmpegInstance: FFmpeg | null = null
let loadingPromise: Promise<FFmpeg> | null = null
const recentLogs: string[] = []

async function loadFromBase(base: string): Promise<FFmpeg> {
  const ff = new FFmpeg()
  ff.on('log', ({ message }) => {
    console.debug('[ffmpeg]', message)
    recentLogs.push(message)
    if (recentLogs.length > LOG_BUFFER_SIZE) recentLogs.shift()
  })
  await ff.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
  })
  return ff
}

/** 加载（并缓存）ffmpeg.wasm 实例，多 CDN 依次回退 */
export function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return Promise.resolve(ffmpegInstance)
  if (loadingPromise) return loadingPromise
  loadingPromise = (async () => {
    let lastError: unknown
    for (const base of CORE_BASES) {
      try {
        ffmpegInstance = await loadFromBase(base)
        return ffmpegInstance
      } catch (err) {
        console.warn('[ffmpeg] 镜像加载失败，尝试下一个', base, err)
        lastError = err
      }
    }
    loadingPromise = null
    throw lastError instanceof Error ? lastError : new Error('ffmpeg 核心加载失败')
  })()
  return loadingPromise
}

/** 丢弃当前实例，下次调用时重新加载（core 中止或内存损坏后用于恢复） */
export function resetFFmpeg() {
  const stale = ffmpegInstance
  ffmpegInstance = null
  loadingPromise = null
  try {
    stale?.terminate()
  } catch {
    // 已中止的实例无需处理
  }
}

// core 失败时日志里往往先有一行根因，结尾才是 Conversion failed! / Aborted() 这类笼统提示，
// 因此按“根因 → 泛泛失败 → 中止”三级依次匹配
const FAILURE_PATTERNS = [
  /invalid data|no such file|unsupported|out of memory|memory access|does not contain|unknown (format|codec|encoder|decoder)|could not (open|find)|error opening|decoder.*not found/i,
  /failed|error/i,
  /abort/i,
]

/** 从 core 日志中挑出最可能的失败原因，便于用户直接看到真实错误 */
function reasonFromLogs(): string {
  const lines = recentLogs.map((line) => line.trim()).filter(Boolean)
  for (const pattern of FAILURE_PATTERNS) {
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      if (pattern.test(lines[i])) return lines[i]
    }
  }
  return ''
}

export interface ConvertResult {
  blob: Blob
  url: string
}

/** 带诊断结论的转换异常，code 供 UI 映射成可操作的提示 */
export class ConvertError extends Error {
  constructor(
    message: string,
    readonly code?: 'incomplete-file',
    readonly params?: Record<string, number>
  ) {
    super(message)
    this.name = 'ConvertError'
  }
}

/**
 * 检查 mp3 的 ID3v2 标签是否声称了超出文件长度的音频起点。
 * 下载中断、导出未完成的 mp3 常如此，ffmpeg 会报
 * “Failed to read frame size: Could not seek to N”或“Invalid data found”
 */
async function inspectMp3Truncation(file: File): Promise<number> {
  const head = new Uint8Array(await file.slice(0, 10).arrayBuffer())
  if (head.length < 10 || head[0] !== 0x49 || head[1] !== 0x44 || head[2] !== 0x33) return 0
  // ID3v2 长度用 4 个 syncsafe 字节表示，每字节仅低 7 位有效
  const tagSize =
    ((head[6] & 0x7f) << 21) | ((head[7] & 0x7f) << 14) | ((head[8] & 0x7f) << 7) | (head[9] & 0x7f)
  const audioStart = tagSize + 10
  return audioStart >= file.size ? audioStart : 0
}

/**
 * 应用磁带滤镜链并转码为 192k MP3，
 * 与仓库 convert_cassette_*.sh 中的 ffmpeg 命令一致。
 * tolerant 为真时放宽探测范围并忽略可修复的码流错误，给残缺文件一次机会
 */
async function runConvert(
  file: File,
  filterComplex: string,
  onProgress: (ratio: number) => void,
  tolerant = false
): Promise<ConvertResult> {
  const ff = await getFFmpeg()
  recentLogs.length = 0
  const rawExt = (file.name.split('.').pop() || '').toLowerCase()
  // 扩展名仅用于帮助 core 选择解封装器，非白名单后缀交由 ffmpeg 自行探测
  const inputName = ACCEPTED_EXT.includes(rawExt) ? `input.${rawExt}` : 'input'
  const outputName = 'output.mp3'

  const input = await fetchFile(file)
  // 写入字节数必须与文件一致，否则 ffmpeg 会把“读不完整”误报成容器损坏
  if (input.byteLength !== file.size) {
    throw new Error(`文件读取不完整（${input.byteLength}/${file.size} 字节）`)
  }
  await ff.writeFile(inputName, input)

  const progressHandler = ({ progress }: { progress: number }) => {
    onProgress(Math.max(0, Math.min(1, progress)))
  }
  ff.on('progress', progressHandler)

  try {
    const code = await ff.exec([
      ...(tolerant ? ['-err_detect', 'ignore_err', '-probesize', '50M', '-analyzeduration', '100M'] : []),
      '-i', inputName,
      '-filter_complex', filterComplex,
      '-map', '[out]',
      '-c:a', 'libmp3lame',
      '-b:a', '192k',
      outputName,
    ])
    if (code !== 0) {
      throw new Error(`ffmpeg 退出码 ${code}`)
    }
    const data = await ff.readFile(outputName)
    const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(data)
    if (bytes.length === 0) {
      throw new Error('输出文件为空')
    }
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/mpeg' })
    return { blob, url: URL.createObjectURL(blob) }
  } finally {
    ff.off('progress', progressHandler)
    await ff.deleteFile(inputName).catch(() => {})
    await ff.deleteFile(outputName).catch(() => {})
  }
}

/**
 * 转换入口：core 一旦 Aborted，实例内存即不可再用，
 * 因此首次失败后重建引擎、改用宽容参数重试一次，
 * 避免用户遇到“必须刷新页面”的卡死状态
 */
export async function convertWithTape(
  file: File,
  filterComplex: string,
  onProgress: (ratio: number) => void
): Promise<ConvertResult> {
  // 音频起点超出文件末尾是确定性损坏，直接拦下，不必白跑两遍转换
  const audioStart = await inspectMp3Truncation(file).catch(() => 0)
  if (audioStart) {
    throw new ConvertError('音频数据不完整', 'incomplete-file', {
      start: audioStart,
      size: file.size,
    })
  }
  try {
    return await runConvert(file, filterComplex, onProgress)
  } catch (firstError) {
    console.warn('[ffmpeg] 首次转换失败，重建引擎后宽容重试', firstError)
    resetFFmpeg()
    onProgress(0)
    try {
      return await runConvert(file, filterComplex, onProgress, true)
    } catch (retryError) {
      const message = retryError instanceof Error ? retryError.message : String(retryError)
      throw new ConvertError(reasonFromLogs() || message)
    }
  }
}
