'use client'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '~/components/ui/data-table/pagination'
import { DataTableViewOptions } from '~/components/ui/data-table/view-options'
import { Input } from '~/components/ui/input'

import DeleteSelectedStudents from '~/components/dashboard/students/delete-selected-records'
import AddStudentForm from '~/components/dashboard/students/form-record-create'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // State for table options, e.g. sorting, column visibility, etc.
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Create the table instance using the useReactTable hook and the options state above
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
  })

  return (
    <>
      <div className="flex justify-between items-center py-4">
        {/* Table Info (at top) - used to display controls to manipulate table data */}
        <div className="flex gap-2">
          {/* Search Box - to filter records by student ID */}
          <Input
            placeholder="Search by student ID..."
            defaultValue={
              (table.getColumn('studentId')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('studentId')?.setFilterValue(event.target.value)
            }
            className="max-w-sm shrink-0"
          />
          {/* Table View Options - to customize columns visible on data table */}
          <DataTableViewOptions table={table} />
        </div>
        <div className="flex gap-2">
          {/* Delete Selected Records (Button) - used to delete multiple selected Attendance Records */}
          <DeleteSelectedStudents table={table} />

          {/* Create New Records (Modal + Form) - used to create new Attendance Records */}
          <AddStudentForm />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          {/* Table Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="tabular-nums">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // If no results, display this message instead
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="p-4 pb-6">
          {/* Pagination - To navigate between pages of data */}
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  )
}
