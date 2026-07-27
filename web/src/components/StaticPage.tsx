import { useTranslation } from 'react-i18next'

interface Section {
  h: string
  p: string
}

interface Props {
  page: 'about' | 'privacy'
  onBack: () => void
}

const REPO_URL = 'https://github.com/topics/cassette'

/** 关于本站 / 隐私政策 静态内容页 */
export default function StaticPage({ page, onBack }: Props) {
  const { t } = useTranslation()

  return (
    <div className="static-page">
      <button type="button" className="btn-back" onClick={onBack}>
        {t('nav.back')}
      </button>

      {page === 'about' ? (
        <article>
          <h1 className="static-title">{t('about.title')}</h1>
          <p className="static-text">{t('about.p1')}</p>
          <p className="static-text">{t('about.p2')}</p>
          <p className="static-text">{t('about.p3')}</p>
          <h2 className="static-subtitle">{t('about.contactTitle')}</h2>
          <p className="static-text">
            {t('about.contact')}{' '}
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub →
            </a>
          </p>
        </article>
      ) : (
        <article>
          <h1 className="static-title">{t('privacy.title')}</h1>
          <p className="static-updated">{t('privacy.updated')}</p>
          <p className="static-text">{t('privacy.intro')}</p>
          {(t('privacy.sections', { returnObjects: true }) as Section[]).map((section) => (
            <section key={section.h}>
              <h2 className="static-subtitle">{section.h}</h2>
              <p className="static-text">{section.p}</p>
            </section>
          ))}
        </article>
      )}
    </div>
  )
}
