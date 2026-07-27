import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

export const SUPPORTED_LANGS = ['zh-CN', 'en-US'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

const STORAGE_KEY = 'cassette-lang'

function normalizeLang(value: string | null): Lang | null {
  if (!value) return null
  const low = value.toLowerCase()
  if (low.startsWith('zh')) return 'zh-CN'
  if (low.startsWith('en')) return 'en-US'
  return null
}

/** 语言检测优先级：URL ?lang 参数 > localStorage > 浏览器语言 */
export function detectLang(): Lang {
  const fromUrl = normalizeLang(new URLSearchParams(window.location.search).get('lang'))
  if (fromUrl) return fromUrl
  try {
    const stored = normalizeLang(localStorage.getItem(STORAGE_KEY))
    if (stored) return stored
  } catch {
    // localStorage 不可用时忽略
  }
  return normalizeLang(navigator.language) ?? 'en-US'
}

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN },
    'en-US': { translation: enUS },
  },
  lng: detectLang(),
  fallbackLng: 'en-US',
  interpolation: { escapeValue: false },
})

// 同步 <html> 的 lang 与 dir（RTL 语言就绪：i18n.dir 对 ar/he 等自动返回 rtl）
function syncDocumentLang(lng: string) {
  document.documentElement.lang = lng
  document.documentElement.dir = i18n.dir(lng)
}

syncDocumentLang(i18n.language)

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    // 忽略写入失败
  }
  syncDocumentLang(lng)
})

export default i18n
