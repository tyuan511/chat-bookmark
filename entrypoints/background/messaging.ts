import { onMessage } from '@/lib/messaging'

onMessage('getBookmarkTree', async () => {
  const bookmarkTree = await browser.bookmarks.getTree()
  return bookmarkTree
})
