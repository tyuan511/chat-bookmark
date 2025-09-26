import { useEffect, useState } from 'react'
import { Tree } from '@/components/ui/tree'
import { sendMessage } from '@/lib/messaging'

function convertBookmarksToTreeNodes(bookmarks: Browser.bookmarks.BookmarkTreeNode[]): any[] {
  return bookmarks.map(bookmark => ({
    id: bookmark.id,
    title: bookmark.title || '无标题',
    url: bookmark.url,
    children: bookmark.children ? convertBookmarksToTreeNodes(bookmark.children) : undefined,
    icon: bookmark.url ? undefined : undefined,
  }))
}

export function Root() {
  const [bookmarks, setBookmarks] = useState<Browser.bookmarks.BookmarkTreeNode[]>([])
  const [loading, setLoading] = useState(true)

  const getBookmarks = async () => {
    try {
      setLoading(true)
      const tree = await sendMessage('getBookmarkTree')
      console.log(tree)
      setBookmarks(tree[0].children ?? [])
    }
    catch (error) {
      console.error('获取书签失败:', error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBookmarks()
  }, [])

  const treeData = convertBookmarksToTreeNodes(bookmarks)

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">加载书签中...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">书签管理</h1>
        <p className="text-muted-foreground">点击书签可直接打开，右键查看更多操作</p>
      </div>
      <div className="flex flex-1">
        <div className="overflow-auto border rounded-lg p-4 w-[320px] h-full">
          {treeData.length > 0
            ? (
                <Tree
                  data={treeData}
                  className="w-full"
                />
              )
            : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  暂无书签
                </div>
              )}
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  )
}
