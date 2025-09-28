import { onMessage } from '@/lib/messaging'
import { modelSettingSchema, supabaseSettingSchema, systemSettingSchema } from '@/lib/types'
import { bookmarkParseQueue } from './queue'

onMessage('getBookmarkTree', async () => {
  const bookmarkTree = await browser.bookmarks.getTree()
  return bookmarkTree
})

onMessage('saveModelSetting', async (setting) => {
  const result = modelSettingSchema.safeParse(setting.data)
  if (!result.success) {
    return
  }

  await browser.storage.sync.set({ modelSetting: setting.data })
})

onMessage('getModelSetting', async () => {
  const { modelSetting } = await browser.storage.sync.get('modelSetting')
  return modelSetting
})

onMessage('getSupabaseSetting', async () => {
  const { supabaseSetting } = await browser.storage.sync.get('supabaseSetting')
  return supabaseSetting
})

onMessage('saveSupabaseSetting', async (setting) => {
  const result = supabaseSettingSchema.safeParse(setting.data)
  if (!result.success) {
    return
  }
  await browser.storage.sync.set({ supabaseSetting: setting.data })
})

onMessage('syncSavedSupabaseSetting', async () => {
  const { supabaseSetting } = await browser.storage.sync.get('supabaseSetting')
  return supabaseSetting
})

onMessage('getSystemSetting', async () => {
  const { systemSetting } = await browser.storage.sync.get('systemSetting')
  return systemSetting
})

onMessage('saveSystemSetting', async (setting) => {
  const result = systemSettingSchema.safeParse(setting.data)
  if (!result.success) {
    return
  }
  await browser.storage.sync.set({ systemSetting: setting.data })
})

onMessage('syncSavedSystemSetting', async () => {
  const { systemSetting } = await browser.storage.sync.get('systemSetting')
  return systemSetting
})

onMessage('parseBookmarks', async (msg) => {
  const bookmarks = msg.data

  try {
    // 批量添加书签到解析队列
    const results = await bookmarkParseQueue.addBatch(bookmarks)

    console.log(`成功解析 ${results.length} 个书签`)
    return {
      success: true,
      count: results.length,
      results,
    }
  }
  catch (error) {
    console.error('书签解析失败:', error)
    return {
      success: false,
      results: [],
      count: 0,
      error: error instanceof Error ? error.message : '未知错误',
    }
  }
})

/**
 * 获取书签解析队列状态
 */
onMessage('getParseQueueStatus', async () => {
  const status = bookmarkParseQueue.getStatus()
  return status
})

/**
 * 清空书签解析队列
 */
onMessage('clearParseQueue', async () => {
  bookmarkParseQueue.clear()
  return { success: true, message: '队列已清空' }
})

/**
 * 解析单个书签
 */
onMessage('parseBookmark', async (msg) => {
  const bookmark = msg.data

  try {
    const result = await bookmarkParseQueue.add(bookmark)
    return {
      success: true,
      result,
    }
  }
  catch (error) {
    console.error('单个书签解析失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    }
  }
})
