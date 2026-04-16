import { getImageUrl } from './image'
import { resolveApiBaseUrl } from './api-base'

export function processHtmlForDisplay(html: string): string {
  if (!html) return ''

  return html.replace(/src=["'](\/uploads\/.*?)["']/g, (_, path) => {
    return `src="${getImageUrl(path)}"`
  })
}

export function processHtmlForStorage(html: string): string {
  if (!html) return ''

  const apiBaseUrl = resolveApiBaseUrl()
  let apiHost = ''
  try {
    if (apiBaseUrl) {
      apiHost = new URL(apiBaseUrl).host
    } else {
      apiHost = window.location.host
    }
  } catch (e) {
    apiHost = window.location.host
  }

  return html.replace(/src=["'](.*?)["']/g, (match, src) => {
    try {
      if (src.startsWith('http://') || src.startsWith('https://')) {
        const url = new URL(src)
        if (url.host === apiHost && url.pathname.startsWith('/uploads/')) {
          return `src="${url.pathname}"`
        }
      }
    } catch (e) {
      // ignore
    }
    return match
  })
}
