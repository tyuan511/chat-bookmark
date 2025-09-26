interface BookmarkWithPath {
  id: string
  title: string
  url: string
  path: string // 记录文件夹路径，使用 '/' 分隔
}

export async function getBookMarks() {
  const tree = await browser.bookmarks.getTree()

  const flattenBookmarksWithPath = (
    nodes: Browser.bookmarks.BookmarkTreeNode[],
    currentPath: string[] = [],
  ): BookmarkWithPath[] => {
    const result: BookmarkWithPath[] = []

    for (const node of nodes) {
      if (node.url) {
        result.push({
          id: node.id,
          title: node.title || '',
          url: node.url,
          path: currentPath.join('/'),
        })
      }

      if (node.children && node.children.length > 0) {
        const newPath = node.title ? [...currentPath, node.title] : currentPath
        result.push(...flattenBookmarksWithPath(node.children, newPath))
      }
    }

    return result
  }

  return flattenBookmarksWithPath(tree)
}
