import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flattenBookmarksWithPath, getFavicon } from '@/lib/utils'
import { useStore } from '../store'

export function HomePage() {
  const { bookmarks } = useStore()

  const flatBookmarks = useMemo(() => flattenBookmarksWithPath(bookmarks), [bookmarks])

  useEffect(() => {
    console.log(flatBookmarks)
  }, [flatBookmarks])

  const mockData: any[] = Array.from({ length: 10 }).fill(
    {
      name: 'Dribbble - Discover the World’s Top Designers & Creative Professionals',
      url: 'https://dribbble.com',
      path: '书签栏/design',
      status: '解析中',
    },
  )

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">书签解析列表</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>网站名</TableHead>
            <TableHead>网址</TableHead>
            <TableHead>路径</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            mockData.map(item => (
              <TableRow key={item.url}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img src={getFavicon(item.url)} className="size-4" />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>{item.url}</TableCell>
                <TableCell>{item.path}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost">
                    <RotateCcw />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}
