import { SUPPORTED_LANGS } from '../i18n'

export const SITE_URL = 'https://cassette.chainseek.top'

const SEO_ATTR = 'data-seo'

export interface SeoParams {
  lang: string
  title: string
  description: string
  keywords: string
  /** 当前选中的磁带 id，用于永久链接与 og 图片 */
  tapeId?: string
  tapeName?: string
  /** 静态内容页（about/privacy），用于永久链接 */
  page?: string
  /** FAQ 问答列表，生成 FAQPage 结构化数据 */
  faq?: { q: string; a: string }[]
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute(SEO_ATTR, '')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function buildUrl(tapeId?: string, lang?: string, page?: string): string {
  const params = new URLSearchParams()
  if (page) params.set('page', page)
  else if (tapeId) params.set('tape', tapeId)
  if (lang) params.set('lang', lang)
  const qs = params.toString()
  return qs ? `${SITE_URL}/?${qs}` : `${SITE_URL}/`
}

/** 根据当前语言与磁带选择更新 title/meta/OG/Twitter/hreflang/JSON-LD */
export function applySeo({ lang, title, description, keywords, tapeId, tapeName, page, faq }: SeoParams) {
  document.title = title

  upsertMeta('name', 'description', description)
  upsertMeta('name', 'keywords', keywords)

  const pageUrl = buildUrl(tapeId, lang, page)
  const ogImage = tapeId && !page ? `${SITE_URL}/covers/${tapeId}.jpg` : `${SITE_URL}/og-cover.jpg`

  // Open Graph
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', 'Cassette Simulator')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', pageUrl)
  upsertMeta('property', 'og:image', ogImage)
  upsertMeta('property', 'og:locale', lang.replace('-', '_'))

  // Twitter Card
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', ogImage)

  // canonical 与 hreflang（canonical 不带 lang 参数，作为 x-default）
  document.head
    .querySelectorAll(`link[${SEO_ATTR}]`)
    .forEach((el) => el.remove())

  const canonical = document.createElement('link')
  canonical.rel = 'canonical'
  canonical.href = buildUrl(tapeId, undefined, page)
  canonical.setAttribute(SEO_ATTR, '')
  document.head.appendChild(canonical)

  for (const l of SUPPORTED_LANGS) {
    const alt = document.createElement('link')
    alt.rel = 'alternate'
    alt.hreflang = l
    alt.href = buildUrl(tapeId, l, page)
    alt.setAttribute(SEO_ATTR, '')
    document.head.appendChild(alt)
  }
  const xDefault = document.createElement('link')
  xDefault.rel = 'alternate'
  xDefault.hreflang = 'x-default'
  xDefault.href = buildUrl(tapeId, undefined, page)
  xDefault.setAttribute(SEO_ATTR, '')
  document.head.appendChild(xDefault)

  // JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cassette Simulator',
    url: pageUrl,
    image: ogImage,
    description,
    inLanguage: lang,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web browser',
    browserRequirements: 'Requires JavaScript and WebAssembly',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Cassette tape hiss simulation',
      'Wow & flutter pitch modulation',
      'Bandwidth limiting and vintage EQ coloring',
      'Local in-browser audio processing with ffmpeg.wasm',
      ...(tapeName ? [`${tapeName} tape profile`] : []),
    ],
  }
  let script = document.head.querySelector<HTMLScriptElement>('#seo-jsonld')
  if (!script) {
    script = document.createElement('script')
    script.id = 'seo-jsonld'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(jsonLd)

  // FAQPage 结构化数据（仅首页有 FAQ 内容时生成）
  let faqScript = document.head.querySelector<HTMLScriptElement>('#seo-faq-jsonld')
  if (faq && faq.length > 0) {
    if (!faqScript) {
      faqScript = document.createElement('script')
      faqScript.id = 'seo-faq-jsonld'
      faqScript.type = 'application/ld+json'
      document.head.appendChild(faqScript)
    }
    faqScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  } else {
    faqScript?.remove()
  }
}
