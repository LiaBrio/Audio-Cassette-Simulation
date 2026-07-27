import { useTranslation } from 'react-i18next'
import type { TapePreset } from '../presets'

interface Props {
  preset: TapePreset
  selected: boolean
  disabled?: boolean
  onSelect: (id: string) => void
}

export default function TapeCard({ preset, selected, disabled, onSelect }: Props) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      className={`tape-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(preset.id)}
      disabled={disabled}
      aria-pressed={selected}
    >
      <div className="tape-cover">
        <img src={preset.cover} alt={t('tape.coverAlt', { name: preset.name })} loading="lazy" />
        {selected && <span className="tape-badge">{t('tape.loaded')}</span>}
      </div>
      <div className="tape-info">
        <h3 className="tape-name">{preset.name}</h3>
        <p className="tape-meta">
          {t(`tapes.${preset.id}.origin`)} · {preset.era}
        </p>
        <p className="tape-desc">{t(`tapes.${preset.id}.description`)}</p>
        <div className="tape-specs">
          <span>
            {t('tape.hiss')} {t(`tapes.${preset.id}.hiss`)}
          </span>
          <span>≤{preset.lowpass}</span>
          <span>{t(`tapes.${preset.id}.character`)}</span>
        </div>
      </div>
    </button>
  )
}
