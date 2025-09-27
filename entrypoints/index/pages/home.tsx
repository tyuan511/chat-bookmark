import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import type { BookMarkNode } from '@/lib/types'
import {

  getCoreRowModel,

  useReactTable,
} from '@tanstack/react-table'
import { RotateCcw } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { flattenBookmarksWithPath, getFavicon } from '@/lib/utils'
import { useStore } from '../store'
import { DataTable } from './home/data-table'

export function HomePage() {
  const { bookmarks } = useStore()
  const tableContainer = useRef<HTMLDivElement>(null)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const flatBookmarks = useMemo(() => flattenBookmarksWithPath(bookmarks), [bookmarks])
  const [tableWidth, setTableWidth] = useState(0)

  useEffect(() => {
    const onSizeChange = () => {
      setTableWidth(tableContainer.current?.offsetWidth || 0)
    }

    window.addEventListener('resize', onSizeChange)
    return () => {
      window.removeEventListener('resize', onSizeChange)
    }
  }, [])

  const columns: ColumnDef<BookMarkNode>[] = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
            aria-label="全选"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label={`选择 ${row.original.title}`}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: 'title',
      header: '网站名',
      cell: ({ row }) => (
        <div className="w-full font-medium flex items-center gap-2" title={row.original.title}>
          <img src={getFavicon(row.original.url || '')} className="w-4 h-4" />
          <div className="w-[calc(100%-24px)] truncate" title={row.original.title}>
            {row.original.title}
          </div>
        </div>
      ),
      size: (tableWidth - 220) * 0.3,
    },
    {
      accessorKey: 'url',
      header: '网址',
      cell: ({ row }) => (
        <div className="truncate" title={row.original.url || ''}>
          <a
            href={row.original.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {row.original.url}
          </a>
        </div>
      ),
      size: (tableWidth - 220) * 0.5,
    },
    {
      accessorKey: 'path',
      header: '路径',
      cell: ({ row }) => (
        <div className="truncate" title={row.original.path}>
          {row.original.path}
        </div>
      ),
      size: (tableWidth - 220) * 0.2,
    },
    {
      id: 'status',
      header: '状态',
      cell: () => (
        <div className="flex justify-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            待解析
          </span>
        </div>
      ),
      size: 80,
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              console.log('重新解析:', row.original)
              // 这里可以添加重新解析的逻辑
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      ),
      size: 80,
    },
  ], [tableWidth])

  const table = useReactTable({
    data: flatBookmarks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  })

  useEffect(() => {
    if (tableContainer.current) {
      setTableWidth(tableContainer.current.offsetWidth)
    }
  }, [])

  return (
    <div className="h-[calc(100vh-120px)] w-full overflow-hidden" ref={tableContainer}>
      <DataTable table={table} className="h-full" />
    </div>
  )
}
