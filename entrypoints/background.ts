import { getBookMarks } from '@/lib/browser'

export default defineBackground(() => {
  run()
})

async function run() {
  console.log('Hello background!', { id: browser.runtime.id })
  const bookmarks = await getBookMarks()
  console.log(`共找到书签${bookmarks.length}条`)
}
