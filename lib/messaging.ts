import type { ModelSettingType, SupabaseSettingType } from './types'
import { defineExtensionMessaging } from '@webext-core/messaging'

interface ProtocolMap {
  getBookmarkTree: () => Promise<Browser.bookmarks.BookmarkTreeNode[]>
  getModelSetting: () => Promise<ModelSettingType>
  saveModelSetting: (setting: ModelSettingType) => Promise<void>
  getSupabaseSetting: () => Promise<SupabaseSettingType>
  saveSupabaseSetting: (setting: SupabaseSettingType) => Promise<void>
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()
