import type { ReadabilityResult } from '@/lib/types'
import z from 'zod'
import { sendMessage } from '@/lib/messaging'
import { embed, generateObject } from './ai'
import { CATEGORIZE_CONTENT_PROMPT } from './prompt'

export class BookmarkParseQueue {
  private queue: Array<{
    id: string
    bookmark: any
    resolve: (result: any) => void
    reject: (error: any) => void
    retryCount: number
  }> = []

  private processing = new Set<string>()
  private maxConcurrency: number
  private isProcessing = false

  constructor(maxConcurrency = 3) {
    this.maxConcurrency = maxConcurrency
  }

  /**
   * 添加书签到解析队列
   */
  async add(bookmark: any): Promise<any> {
    const id = this.generateId()

    return new Promise((resolve, reject) => {
      this.queue.push({
        id,
        bookmark,
        resolve,
        reject,
        retryCount: 0,
      })

      // 立即尝试处理队列
      this.processQueue()
    })
  }

  /**
   * 批量添加书签到解析队列
   */
  async addBatch(bookmarks: any[]): Promise<any[]> {
    const promises = bookmarks.map(bookmark => this.add(bookmark))
    return Promise.all(promises)
  }

  /**
   * 处理队列中的书签
   */
  private async processQueue() {
    if (this.isProcessing || this.processing.size >= this.maxConcurrency) {
      return
    }

    this.isProcessing = true

    while (this.queue.length > 0 && this.processing.size < this.maxConcurrency) {
      const item = this.queue.shift()
      if (!item)
        continue

      this.processing.add(item.id)

      // 异步处理书签解析
      this.processBookmark(item)
    }

    this.isProcessing = false
  }

  /**
   * 解析单个书签
   */
  private async processBookmark(item: {
    id: string
    bookmark: any
    resolve: (result: any) => void
    reject: (error: any) => void
    retryCount: number
  }) {
    try {
      const result = await this.parseBookmark(item.bookmark)
      item.resolve(result)
    }
    catch (error) {
      if (item.retryCount < 2) {
        item.retryCount++
        this.queue.unshift(item)

        setTimeout(() => {
          this.processQueue()
        }, 1000 * item.retryCount)
      }
      else {
        item.reject(error)
      }
    }
    finally {
      this.processing.delete(item.id)
      this.processQueue()
    }
  }

  /**
   * 实际的书签解析逻辑
   * 这里可以集成AI模型进行内容解析
   */
  private async parseBookmark(bookmark: any): Promise<any> {
    try {
      if (!bookmark.url || !bookmark.title) {
        throw new Error('书签缺少必要的URL或标题信息')
      }

      const parsedData = await this.performActualParsing(bookmark)
      console.log(parsedData)

      return {
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        parsedAt: new Date().toISOString(),
        status: 'completed',
        ...parsedData,
      }
    }
    catch (error) {
      console.error(`解析书签失败 [${bookmark.title}]:`, error)
      throw error
    }
  }

  /**
   * 执行实际的书签解析
   * 这里可以集成各种AI服务和数据处理逻辑
   */
  private async performActualParsing(bookmark: any): Promise<{ summary: string, categories: string[], embedding: number[], contentLength: number, language: string }> {
    const article = await this.fetchPageContent(bookmark.url)
    const [embedding, { categories, summary }] = await Promise.all([
      this.generateEmbedding(article.content),
      this.analysisContent(article),
    ])

    return {
      summary,
      categories,
      embedding,
      contentLength: article.content.length,
      language: article.lang || 'zh-CN',
    }
  }

  /**
   * 获取页面内容（需要配合content script）
   */
  private async fetchPageContent(url: string): Promise<ReadabilityResult> {
    const response = await fetch(url)
    const text = await response.text()
    const res = await sendMessage('getReadability', text)
    console.log(res)
    return res
  }

  /**
   * 生成嵌入向量（AI模型）
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    console.log(text)
    const { embedding } = await embed({
      value: text,
    })
    console.log('generateEmbedding', embedding)
    return embedding
  }

  /**
   * 内容分类（AI模型）
   */
  private async analysisContent(article: ReadabilityResult): Promise<{ summary: string, categories: string[] }> {
    const res = await generateObject({
      prompt: CATEGORIZE_CONTENT_PROMPT.replace('{{title}}', article.title).replace('{{description}}', article.description).replace('{{content}}', article.content),
      schema: z.object({
        categories: z.array(z.string()),
        summary: z.string(),
      }),
    } as any)
    try {
      return { summary: (res.object as any).summary || '', categories: (res.object as any).categories || [] }
    }
    catch (error) {
      console.error('解析分类结果失败:', error)
      return { summary: '', categories: [] }
    }
  }

  /**
   * 获取队列状态
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      processingCount: this.processing.size,
      maxConcurrency: this.maxConcurrency,
      isProcessing: this.isProcessing,
    }
  }

  /**
   * 清空队列
   */
  clear() {
    this.queue = []
    this.processing.clear()
    this.isProcessing = false
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * 全局书签解析队列实例
 */
export const bookmarkParseQueue = new BookmarkParseQueue(3)
