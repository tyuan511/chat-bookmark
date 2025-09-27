import type { ModelSettingType, SupabaseSettingType, SystemSettingType } from './types'
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
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()
