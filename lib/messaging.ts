import type { ModelSettingType, ReadabilityResult, SupabaseSettingType, SystemSettingType } from './types'
import { defineExtensionMessaging } from '@webext-core/messaging'

interface ProtocolMap {
  getBookmarkTree: () => Promise<Browser.bookmarks.BookmarkTreeNode[]>
  getModelSetting: () => Promise<ModelSettingType>
  saveModelSetting: (setting: ModelSettingType) => Promise<void>
  getSupabaseSetting: () => Promise<SupabaseSettingType>
  saveSupabaseSetting: (setting: SupabaseSettingType) => Promise<void>
  syncSavedSupabaseSetting: () => Promise<void>
  getSystemSetting: () => Promise<SystemSettingType>
  saveSystemSetting: (setting: SystemSettingType) => Promise<void>
  syncSavedSystemSetting: () => Promise<void>
  getReadability: (content: string) => ReadabilityResult
  parseBookmarks: (bookmarks: Browser.bookmarks.BookmarkTreeNode[]) => Promise<{
    success: boolean
    count: number
    results: any[]
    error?: string
  }>
  parseBookmark: (bookmark: Browser.bookmarks.BookmarkTreeNode) => Promise<{
    success: boolean
    result?: any
    error?: string
  }>
  getParseQueueStatus: () => Promise<{
    queueLength: number
    processingCount: number
    maxConcurrency: number
    isProcessing: boolean
  }>
  clearParseQueue: () => Promise<{
    success: boolean
    message: string
  }>
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()
