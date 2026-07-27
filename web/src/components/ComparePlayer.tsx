import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  originalUrl: string
  convertedUrl: string
  tapeName: string
  downloadName: string
  convertedBlob: Blob
}

function formatTime(sec: number): string {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * A/B 对比播放器：原始音轨与磁带处理音轨同步播放，
 * 通过静音切换实现无缝对比
 */
export default function ComparePlayer({
  originalUrl,
  convertedUrl,
  tapeName,
  downloadName,
  convertedBlob,
}: Props) {
  const { t } = useTranslation()
  const originalRef = useRef<HTMLAudioElement>(null)
  const convertedRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [mode, setMode] = useState<'converted' | 'original'>('converted')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // 静音状态跟随对比模式
  useEffect(() => {
    const orig = originalRef.current
    const conv = convertedRef.current
    if (!orig || !conv) return
    orig.muted = mode !== 'original'
    conv.muted = mode !== 'converted'
    // 切换时校正两条音轨的时间漂移
    const active = mode === 'original' ? orig : conv
    const inactive = mode === 'original' ? conv : orig
    if (Math.abs(active.currentTime - inactive.currentTime) > 0.15) {
      inactive.currentTime = active.currentTime
    }
  }, [mode])

  useEffect(() => {
    // 音源变化时重置状态
    setPlaying(false)
    setCurrentTime(0)
    setMode('converted')
  }, [convertedUrl])

  const togglePlay = async () => {
    const orig = originalRef.current
    const conv = convertedRef.current
    if (!orig || !conv) return
    if (playing) {
      orig.pause()
      conv.pause()
      setPlaying(false)
    } else {
      orig.currentTime = conv.currentTime
      await Promise.allSettled([orig.play(), conv.play()])
      setPlaying(true)
    }
  }

  const seek = (value: number) => {
    const orig = originalRef.current
    const conv = convertedRef.current
    if (!orig || !conv) return
    orig.currentTime = value
    conv.currentTime = value
    setCurrentTime(value)
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(convertedBlob)
    a.download = downloadName
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000)
  }

  return (
    <div className="player">
      <audio
        ref={convertedRef}
        src={convertedUrl}
        preload="metadata"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          originalRef.current?.pause()
          setPlaying(false)
        }}
      />
      <audio ref={originalRef} src={originalUrl} preload="metadata" muted />

      <div className="player-header">
        <div className="player-reel" data-spinning={playing}>
          <span className="reel" />
          <span className="reel" />
        </div>
        <div className="player-title">
          <p className="player-tape">{tapeName}</p>
          <p className="player-mode-label">
            {t('player.listening')}: {mode === 'converted' ? t('player.convertedAudio') : t('player.originalAudio')}
          </p>
        </div>
      </div>

      <div className="player-controls">
        <button className="btn-play" onClick={togglePlay} aria-label={playing ? t('player.pause') : t('player.play')}>
          {playing ? '⏸' : '▶'}
        </button>
        <span className="player-time">{formatTime(currentTime)}</span>
        <input
          className="player-seek"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label={t('player.seek')}
        />
        <span className="player-time">{formatTime(duration)}</span>
      </div>

      <div className="player-actions">
        <div className="ab-toggle" role="group" aria-label={t('player.abToggle')}>
          <button
            className={mode === 'original' ? 'active' : ''}
            onClick={() => setMode('original')}
          >
            {t('player.original')}
          </button>
          <button
            className={mode === 'converted' ? 'active' : ''}
            onClick={() => setMode('converted')}
          >
            {t('player.converted')}
          </button>
        </div>
        <button className="btn-download" onClick={handleDownload}>
          {t('player.download')}
        </button>
      </div>
    </div>
  )
}
