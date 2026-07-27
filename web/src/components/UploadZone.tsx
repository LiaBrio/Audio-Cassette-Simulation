import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ACCEPTED_EXT = ['mp3', 'ogg', 'm4a', 'aac']
const MAX_SIZE_MB = 100

interface Props {
  file: File | null
  onSelect: (file: File) => void
  onError: (msg: string) => void
  disabled?: boolean
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function UploadZone({ file, onSelect, onError, disabled }: Props) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(
    (f: File | undefined) => {
      if (!f) return
      const ext = (f.name.split('.').pop() || '').toLowerCase()
      if (!ACCEPTED_EXT.includes(ext)) {
        onError(t('upload.badFormat', { ext, list: ACCEPTED_EXT.join(' / ') }))
        return
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        onError(t('upload.tooLarge', { max: MAX_SIZE_MB }))
        return
      }
      onSelect(f)
    },
    [onSelect, onError, t]
  )

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!disabled) handleFile(e.dataTransfer.files?.[0])
      }}
      role="button"
      tabIndex={0}
      aria-label={t('upload.ariaLabel')}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.ogg,.m4a,.aac,audio/mpeg,audio/ogg,audio/mp4,audio/aac"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {file ? (
        <div className="upload-file-info">
          <span className="upload-icon">🎵</span>
          <div>
            <p className="upload-filename">{file.name}</p>
            <p className="upload-filesize">{t('upload.change', { size: formatSize(file.size) })}</p>
          </div>
        </div>
      ) : (
        <div className="upload-placeholder">
          <span className="upload-icon">📼</span>
          <p className="upload-title">{t('upload.title')}</p>
          <p className="upload-hint">{t('upload.hint', { max: MAX_SIZE_MB })}</p>
        </div>
      )}
    </div>
  )
}
