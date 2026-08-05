import { useCallback, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import UploadZone from './components/UploadZone'
import TapeCard from './components/TapeCard'
import ComparePlayer from './components/ComparePlayer'
import LanguageSwitcher from './components/LanguageSwitcher'
import InfoSections from './components/InfoSections'
import StaticPage from './components/StaticPage'
import { TAPE_PRESETS } from './presets'
import { convertWithTape, getFFmpeg, resetFFmpeg } from './lib/ffmpeg'
import { applySeo } from './lib/seo'

type EngineState = 'loading' | 'ready' | 'error'
type ConvertState = 'idle' | 'converting' | 'done' | 'error'
type Page = 'home' | 'about' | 'privacy'

interface Result {
  blob: Blob
  url: string
  tapeId: string
}

/** 从 URL ?tape 参数恢复磁带选择（永久链接支持） */
function initialTapeId(): string {
  const fromUrl = new URLSearchParams(window.location.search).get('tape')
  return TAPE_PRESETS.some((p) => p.id === fromUrl) ? (fromUrl as string) : 'chf60'
}

/** 从 URL ?page 参数恢复静态内容页 */
function initialPage(): Page {
  const fromUrl = new URLSearchParams(window.location.search).get('page')
  return fromUrl === 'about' || fromUrl === 'privacy' ? fromUrl : 'home'
}

export default function App() {
  const { t, i18n } = useTranslation()
  const [engine, setEngine] = useState<EngineState>('loading')
  const [file, setFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string>('')
  const [tapeId, setTapeId] = useState<string>(initialTapeId)
  const [page, setPage] = useState<Page>(initialPage)
  const [convertState, setConvertState] = useState<ConvertState>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string>('')
  const [shareCopied, setShareCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  // 预加载 ffmpeg.wasm 引擎
  useEffect(() => {
    getFFmpeg()
      .then(() => setEngine('ready'))
      .catch(() => setEngine('error'))
  }, [])

  // 引擎加载失败时（多为 CDN 网络问题）允许原地重试，无需刷新页面
  const reloadEngine = () => {
    setEngine('loading')
    resetFFmpeg()
    getFFmpeg()
      .then(() => setEngine('ready'))
      .catch(() => setEngine('error'))
  }

  // 选中文件变化时维护原始音频的 object URL
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setOriginalUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const selectedPreset = TAPE_PRESETS.find((p) => p.id === tapeId)

  // URL 参数与磁带/语言/页面选择保持同步（永久链接），并更新 SEO meta 标签
  useEffect(() => {
    const params = new URLSearchParams()
    if (page !== 'home') params.set('page', page)
    else params.set('tape', tapeId)
    params.set('lang', i18n.language)
    window.history.replaceState(null, '', `${window.location.pathname}?${params}`)

    if (page !== 'home') {
      applySeo({
        lang: i18n.language,
        title: t(`${page}.seoTitle`),
        description: t(`${page}.seoDescription`),
        keywords: t('seo.keywords'),
        page,
      })
      return
    }

    applySeo({
      lang: i18n.language,
      title: selectedPreset
        ? t('seo.tapeTitle', { name: selectedPreset.name })
        : t('seo.title'),
      description: selectedPreset
        ? t('seo.tapeDescription', {
            name: selectedPreset.name,
            desc: t(`tapes.${selectedPreset.id}.description`),
          })
        : t('seo.description'),
      keywords: t('seo.keywords'),
      tapeId,
      tapeName: selectedPreset?.name,
      faq: t('content.faq', { returnObjects: true }) as { q: string; a: string }[],
    })
  }, [tapeId, page, i18n.language, t, selectedPreset])

  const navigate = (target: Page) => {
    setPage(target)
    window.scrollTo({ top: 0 })
  }

  const handleSelectFile = useCallback((f: File) => {
    setFile(f)
    setResult(null)
    setConvertState('idle')
    setError('')
  }, [])

  const handleConvert = async () => {
    if (!file || convertState === 'converting') return
    const preset = TAPE_PRESETS.find((p) => p.id === tapeId)
    if (!preset) return

    setConvertState('converting')
    setProgress(0)
    setError('')
    setResult(null)
    try {
      const { blob, url } = await convertWithTape(file, preset.filterComplex, setProgress)
      setResult({ blob, url, tapeId: preset.id })
      setConvertState('done')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      console.error(err)
      // 带上 ffmpeg 的真实报错，便于用户判断是文件问题还是内存/网络问题
      const reason = err instanceof Error ? err.message.trim() : ''
      setError(reason ? t('convert.failedReason', { reason }) : t('convert.failed'))
      setConvertState('error')
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?tape=${tapeId}&lang=${i18n.language}`
    try {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch {
      // 剪贴板不可用时退回 prompt
      window.prompt('URL', url)
    }
  }

  const resultPreset = result ? TAPE_PRESETS.find((p) => p.id === result.tapeId) : null
  const converting = convertState === 'converting'
  const downloadName = file
    ? `${file.name.replace(/\.[^.]+$/, '')}_${result?.tapeId ?? ''}_cassette.mp3`
    : 'cassette.mp3'

  // 页脚（含站内导航，供用户与搜索引擎爬虫访问关于/隐私页面）
  const footerEl = (
    <footer className="footer">
      <nav className="footer-nav">
        <a
          href={`?tape=${tapeId}&lang=${i18n.language}`}
          onClick={(e) => {
            e.preventDefault()
            navigate('home')
          }}
        >
          {t('nav.home')}
        </a>
        <a
          href={`?page=about&lang=${i18n.language}`}
          onClick={(e) => {
            e.preventDefault()
            navigate('about')
          }}
        >
          {t('nav.about')}
        </a>
        <a
          href={`?page=privacy&lang=${i18n.language}`}
          onClick={(e) => {
            e.preventDefault()
            navigate('privacy')
          }}
        >
          {t('nav.privacy')}
        </a>
      </nav>
      <p>
        <Trans
          i18nKey="footer.text"
          components={[
            <a
              key="repo"
              href="https://github.com/topics/cassette"
              target="_blank"
              rel="noreferrer"
            />,
          ]}
        />
      </p>
    </footer>
  )

  // 关于 / 隐私政策 静态内容页
  if (page !== 'home') {
    return (
      <div className="app">
        <div className="topbar">
          <LanguageSwitcher />
        </div>
        <main>
          <StaticPage page={page} onBack={() => navigate('home')} />
        </main>
        {footerEl}
      </div>
    )
  }

  return (
    <div className="app">
      <div className="topbar">
        <LanguageSwitcher />
      </div>

      <header className="hero">
        <p className="hero-kicker">{t('hero.kicker')}</p>
        <h1 className="hero-title">
          📼 Cassette <span>Simulator</span>
        </h1>
        <p className="hero-sub">{t('hero.sub')}</p>
        <div className="engine-status" data-state={engine}>
          {engine === 'loading' && t('engine.loading')}
          {engine === 'ready' && t('engine.ready')}
          {engine === 'error' && (
            <>
              {t('engine.error')}
              <button type="button" className="engine-retry" onClick={reloadEngine}>
                {t('engine.retry')}
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="step">
          <h2 className="step-title">
            <span className="step-num">01</span> {t('steps.upload')}
          </h2>
          <UploadZone
            file={file}
            onSelect={handleSelectFile}
            onError={(msg) => setError(msg)}
            disabled={converting}
          />
        </section>

        <section className="step">
          <h2 className="step-title">
            <span className="step-num">02</span> {t('steps.tape')}
            <button
              type="button"
              className={`btn-share ${shareCopied ? 'copied' : ''}`}
              onClick={handleShare}
            >
              {shareCopied ? t('share.copied') : t('share.button')}
            </button>
          </h2>
          <div className="tape-grid">
            {TAPE_PRESETS.map((preset) => (
              <TapeCard
                key={preset.id}
                preset={preset}
                selected={tapeId === preset.id}
                disabled={converting}
                onSelect={setTapeId}
              />
            ))}
          </div>
        </section>

        <section className="step">
          <h2 className="step-title">
            <span className="step-num">03</span> {t('steps.convert')}
          </h2>
          <div className="convert-panel">
            <button
              className="btn-convert"
              onClick={handleConvert}
              disabled={!file || converting || engine !== 'ready'}
            >
              {converting
                ? t('convert.converting', { pct: Math.round(progress * 100) })
                : t('convert.button', { name: selectedPreset?.name ?? '' })}
            </button>
            {converting && (
              <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
                <div className="progress-bar" style={{ width: `${Math.max(2, progress * 100)}%` }} />
              </div>
            )}
            {error && <p className="error-msg">⚠ {error}</p>}
            {!file && !error && <p className="convert-hint">{t('convert.hint')}</p>}
          </div>
        </section>

        {result && resultPreset && (
          <section className="step" ref={resultRef}>
            <h2 className="step-title">
              <span className="step-num">04</span> {t('steps.result')}
            </h2>
            <ComparePlayer
              originalUrl={originalUrl}
              convertedUrl={result.url}
              convertedBlob={result.blob}
              tapeName={resultPreset.name}
              downloadName={downloadName}
            />
          </section>
        )}

        <InfoSections />
      </main>

      {footerEl}
    </div>
  )
}
