import { onMessage } from '@/lib/messaging'
import { modelSettingSchema, supabaseSettingSchema } from '@/lib/types'

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
