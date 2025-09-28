import { Readability } from '@mozilla/readability'
import TurndownService from 'turndown'
import { onMessage } from '@/lib/messaging'

const turndownService = new TurndownService()

onMessage('getReadability', (msg) => {
  const content = msg.data
  const doc = new DOMParser().parseFromString(content, 'text/html')
  const reader = new Readability(doc)
  const article = reader.parse()
  const title = doc.querySelector('title')?.textContent ?? ''
  const lang = doc.querySelector('html')?.lang ?? ''
  const description = doc.querySelector('meta[name="description"]')?.textContent ?? ''
  const markdown = turndownService.turndown(article?.content ?? '')

  return {
    title: article?.title || title,
    description: article?.excerpt || description,
    content: markdown,
    lang: article?.lang || lang,
  }
})
