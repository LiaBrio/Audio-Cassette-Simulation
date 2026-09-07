import { useEffect, useRef } from 'react'

interface AdUnitProps {
  /** 广告位 ID，在 AdSense 后台创建广告单元后获得 */
  slot: string
  /** 广告样式：横幅、矩形等，默认自适应 */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

/**
 * AdSense 广告单元。
 * 挂载后调用 (adsbygoogle = window.adsbygoogle || []).push({}) 触发加载。
 * 重复挂载时不会重复 push，避免 AdSense 报错 "pushed more than once"。
 */
export default function AdUnit({ slot, format = 'auto', className }: AdUnitProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    // AdSense 脚本由 index.html 全局加载，这里只需等待它就绪
    const timer = setInterval(() => {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        try {
          window.adsbygoogle.push({})
          pushed.current = true
        } catch {
          // AdSense 未就绪或已被拦截，静默忽略
        }
        clearInterval(timer)
      }
    }, 500)
    return () => clearInterval(timer)
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className ?? ''}`.trim()}
      style={{ display: 'block' }}
      data-ad-client="ca-pub-4044602309325996"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
