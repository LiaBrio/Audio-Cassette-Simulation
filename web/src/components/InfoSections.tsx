import { useTranslation } from 'react-i18next'

interface FaqItem {
  q: string
  a: string
}

/** 首页信息内容区：工作原理 / 磁带小百科 / FAQ，为站点提供原创内容深度 */
export default function InfoSections() {
  const { t } = useTranslation()
  const faq = t('content.faq', { returnObjects: true }) as FaqItem[]

  return (
    <div className="info-sections">
      <section className="info-block">
        <h2 className="info-title">{t('content.howTitle')}</h2>
        <p className="info-text">{t('content.howIntro')}</p>
        <div className="info-grid">
          <article className="info-card">
            <h3>{t('content.how1Title')}</h3>
            <p>{t('content.how1')}</p>
          </article>
          <article className="info-card">
            <h3>{t('content.how2Title')}</h3>
            <p>{t('content.how2')}</p>
          </article>
          <article className="info-card">
            <h3>{t('content.how3Title')}</h3>
            <p>{t('content.how3')}</p>
          </article>
        </div>
      </section>

      <section className="info-block">
        <h2 className="info-title">{t('content.historyTitle')}</h2>
        <p className="info-text">{t('content.history1')}</p>
        <p className="info-text">{t('content.history2')}</p>
      </section>

      <section className="info-block">
        <h2 className="info-title">{t('content.faqTitle')}</h2>
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>
                <h3>{item.q}</h3>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="info-disclaimer">{t('content.disclaimer')}</p>
    </div>
  )
}
