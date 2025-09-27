import { Bolt, Home, Loader2, MessageCircle } from 'lucide-react'
import { Link, Outlet } from 'react-router'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tree } from '@/components/ui/tree'
import { useStore } from '../store'

export function Layout() {
  const { getBookmarks, bookmarks, syncSavedModelSetting, syncSavedSupabaseSetting, syncSavedSystemSetting } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getBookmarks(),
      syncSavedModelSetting(),
      syncSavedSupabaseSetting(),
      syncSavedSystemSetting(),
    ]).then(() => setLoading(false))
  }, [getBookmarks, syncSavedModelSetting, syncSavedSupabaseSetting, syncSavedSystemSetting])

  return loading
    ? (
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
      )
    : (
        <div className="h-screen flex flex-col p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Chat Bookmark</h1>
              <p className="text-muted-foreground">Chat with your bookmark by ai</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button size="icon" variant="outline">
                  <Home className="size-4" />
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="icon" variant="outline">
                  <MessageCircle className="size-4" />
                </Button>
              </Link>
              <Link to="/setting">
                <Button size="icon" variant="outline">
                  <Bolt className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-1 gap-4">
            <ScrollArea className="h-[calc(100vh-120px)] border rounded-lg">
              <div className="p-4  w-[300px]">
                {bookmarks.length > 0
                  ? (
                      <Tree
                        data={bookmarks}
                        className="w-full"
                      />
                    )
                  : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        暂无书签
                      </div>
                    )}
              </div>
            </ScrollArea>
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      )
}
