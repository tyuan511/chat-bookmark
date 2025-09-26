import type { ClassValue } from 'clsx'
import type { BookMarkNode } from './types'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function flattenBookmarksWithPath(nodes: Browser.bookmarks.BookmarkTreeNode[], currentPath: string[] = []): BookMarkNode[] {
  const result: BookMarkNode[] = []

  for (const node of nodes) {
    if (node.url) {
      result.push({
        ...node,
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
