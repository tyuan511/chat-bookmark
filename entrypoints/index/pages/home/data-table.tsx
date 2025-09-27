import type {
  ColumnDef,
  Row,
  RowSelectionState,
  Table as TanStackTable,
} from '@tanstack/react-table'
import type {
  VirtualItem,
  Virtualizer,
} from '@tanstack/react-virtual'
import type { BookMarkNode } from '@/lib/types'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  useVirtualizer,
} from '@tanstack/react-virtual'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface DataTableProps<T = any> {
  table: TanStackTable<T>
  className?: string
}

export function DataTable({ table, className }: DataTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn('h-full overflow-auto border rounded-xl', className)}
      ref={tableContainerRef}
    >
      <Table style={{ display: 'grid' }}>
        <TableHeader
          className="grid sticky top-0 bg-background z-[1]"
        >
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow
              key={headerGroup.id}
              style={{ display: 'flex', width: '100%' }}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="flex items-center"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBodyBlock table={table} tableContainerRef={tableContainerRef} />
      </Table>
    </div>
  )
}

interface TableBodyProps {
  table: TanStackTable<BookMarkNode>
  tableContainerRef: React.RefObject<HTMLDivElement | null>
}

function TableBodyBlock({ table, tableContainerRef }: TableBodyProps) {
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 48,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined'
      && !navigator.userAgent.includes('Firefox')
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <TableBody
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
        position: 'relative', // needed for absolute positioning of rows
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<BookMarkNode>
        return (
          <TableBodyRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
          />
        )
      })}
    </TableBody>
  )
}

interface TableBodyRowProps {
  row: Row<BookMarkNode>
  virtualRow: VirtualItem
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
}

function TableBodyRow({ row, virtualRow, rowVirtualizer }: TableBodyRowProps) {
  return (
    <TableRow
      data-index={virtualRow.index}
      ref={node => rowVirtualizer.measureElement(node)}
      key={row.id}
      className="flex absolute items-center w-full"
      style={{
        transform: `translateY(${virtualRow.start}px)`,
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <TableCell
            key={cell.id}
            className="flex"
            style={{
              width: cell.column.getSize(),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
