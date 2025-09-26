import './messaging'

export default defineBackground(() => {
  run()
})

async function run() {
  console.log('Hello background!', { id: browser.runtime.id })
}
