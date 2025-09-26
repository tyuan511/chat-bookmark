// ./messaging.ts
import { defineExtensionMessaging } from '@webext-core/messaging'

interface ProtocolMap {
  getBookmarkTree: () => Promise<Browser.bookmarks.BookmarkTreeNode[]>
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()
