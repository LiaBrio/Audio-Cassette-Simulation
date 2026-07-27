import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// 单线程版 core（ESM 构建，供 module worker 动态 import），
// 无需 SharedArrayBuffer / COOP+COEP 头，兼容 Vercel 与 Cloudflare Pages
const CORE_VERSION = '0.12.6'
const CORE_BASES = [
  `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`,
  `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`,
]

let ffmpegInstance: FFmpeg | null = null
let loadingPromise: Promise<FFmpeg> | null = null

async function loadFromBase(base: string): Promise<FFmpeg> {
  const ff = new FFmpeg()
  ff.on('log', ({ message }) => console.debug('[ffmpeg]', message))
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
        lastError = err
      }
    }
    loadingPromise = null
    throw lastError instanceof Error ? lastError : new Error('ffmpeg 核心加载失败')
  })()
  return loadingPromise
}

export interface ConvertResult {
  blob: Blob
  url: string
}

/**
 * 应用磁带滤镜链并转码为 192k MP3，
 * 与仓库 convert_cassette_*.sh 中的 ffmpeg 命令一致
 */
export async function convertWithTape(
  file: File,
  filterComplex: string,
  onProgress: (ratio: number) => void
): Promise<ConvertResult> {
  const ff = await getFFmpeg()
  const ext = (file.name.split('.').pop() || 'mp3').toLowerCase()
  const inputName = `input.${ext}`
  const outputName = 'output.mp3'

  await ff.writeFile(inputName, await fetchFile(file))

  const progressHandler = ({ progress }: { progress: number }) => {
    onProgress(Math.max(0, Math.min(1, progress)))
  }
  ff.on('progress', progressHandler)

  try {
    const code = await ff.exec([
      '-i', inputName,
      '-filter_complex', filterComplex,
      '-map', '[out]',
      '-c:a', 'libmp3lame',
      '-b:a', '192k',
      outputName,
    ])
    if (code !== 0) {
      throw new Error(`ffmpeg 退出码 ${code}，转换失败`)
    }
    const data = await ff.readFile(outputName)
    const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(data)
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/mpeg' })
    return { blob, url: URL.createObjectURL(blob) }
  } finally {
    ff.off('progress', progressHandler)
    await ff.deleteFile(inputName).catch(() => {})
    await ff.deleteFile(outputName).catch(() => {})
  }
}
