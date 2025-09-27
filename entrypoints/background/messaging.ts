import { onMessage } from '@/lib/messaging'
import { modelSettingSchema, supabaseSettingSchema, systemSettingSchema } from '@/lib/types'

onMessage('getBookmarkTree', async () => {
  const bookmarkTree = await browser.bookmarks.getTree()
  return bookmarkTree
})

onMessage('saveModelSetting', async (setting) => {
  const result = modelSettingSchema.safeParse(setting.data)
  if (!result.success) {
    return
  }

  await browser.storage.local.set({ modelSetting: setting.data })
})

onMessage('getModelSetting', async () => {
  const { modelSetting } = await browser.storage.local.get('modelSetting')
  return modelSetting
})

onMessage('getSupabaseSetting', async () => {
  const { supabaseSetting } = await browser.storage.local.get('supabaseSetting')
  return supabaseSetting
})

onMessage('saveSupabaseSetting', async (setting) => {
  const result = supabaseSettingSchema.safeParse(setting.data)
  if (!result.success) {
    return
  }
  await browser.storage.local.set({ supabaseSetting: setting.data })
})

onMessage('syncSavedSupabaseSetting', async () => {
  const { supabaseSetting } = await browser.storage.local.get('supabaseSetting')
  return supabaseSetting
})

onMessage('getSystemSetting', async () => {
  const { systemSetting } = await browser.storage.local.get('systemSetting')
  return systemSetting
})

onMessage('saveSystemSetting', async (setting) => {
  const result = systemSettingSchema.safeParse(setting.data)
  if (!result.success) {
    return
  }
  await browser.storage.local.set({ systemSetting: setting.data })
})

onMessage('syncSavedSystemSetting', async () => {
  const { systemSetting } = await browser.storage.local.get('systemSetting')
  return systemSetting
})
