import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGS, type Lang } from '../i18n'

const LANG_LABELS: Record<Lang, string> = {
  'zh-CN': '中文',
  'en-US': 'EN',
}

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="lang-switch" role="group" aria-label={t('langSwitch')}>
      {SUPPORTED_LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          className={i18n.language === lang ? 'active' : ''}
          onClick={() => i18n.changeLanguage(lang)}
          aria-pressed={i18n.language === lang}
        >
          {LANG_LABELS[lang]}
        </button>
      ))}
    </div>
  )
}
