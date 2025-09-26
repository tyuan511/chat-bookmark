import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Chat Bookmark',
    description: 'Chat with your bookmarks',
    chrome_url_overrides: {
      bookmark: 'bookmark.html',
    },
  },
})
