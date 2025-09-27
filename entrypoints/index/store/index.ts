import type { ModelSettingType, SupabaseSettingType, SystemSettingType } from '@/lib/types'
import { create } from 'zustand'
import { sendMessage } from '@/lib/messaging'

interface StoreState {
  modelSetting: ModelSettingType | null
  bookmarks: Browser.bookmarks.BookmarkTreeNode[]
  saveModelSetting: (setting: ModelSettingType) => Promise<void>
  syncSavedModelSetting: () => Promise<void>
  supabaseSetting: SupabaseSettingType | null
  saveSupabaseSetting: (setting: SupabaseSettingType) => Promise<void>
  syncSavedSupabaseSetting: () => Promise<void>
  getBookmarks: () => Promise<void>
  systemSetting: SystemSettingType | null
  saveSystemSetting: (setting: SystemSettingType) => Promise<void>
  syncSavedSystemSetting: () => Promise<void>
}

export const useStore = create<StoreState>(set => ({
  modelSetting: null,
  bookmarks: [],
  systemSetting: null,
  saveModelSetting: async (setting: ModelSettingType) => {
    await sendMessage('saveModelSetting', setting)
    set({ modelSetting: setting })
  },
  syncSavedModelSetting: async () => {
    const modelSetting = await sendMessage('getModelSetting')
    set({ modelSetting })
  },
  getBookmarks: async () => {
    const bookmarks = await sendMessage('getBookmarkTree')
    set({ bookmarks: bookmarks[0].children })
  },
  supabaseSetting: null,
  saveSupabaseSetting: async (setting: SupabaseSettingType) => {
    await sendMessage('saveSupabaseSetting', setting)
    set({ supabaseSetting: setting })
  },
  syncSavedSupabaseSetting: async () => {
    const supabaseSetting = await sendMessage('getSupabaseSetting')
    set({ supabaseSetting })
  },
  saveSystemSetting: async (setting: SystemSettingType) => {
    await sendMessage('saveSystemSetting', setting)
    set({ systemSetting: setting })
  },
  syncSavedSystemSetting: async () => {
    const systemSetting = await sendMessage('getSystemSetting')
    set({ systemSetting })
  },
}))
