'use client'

import { type Lecture } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { Checkbox } from '~/components/ui/checkbox'
import { DataTableColumnHeader } from '~/components/ui/data-table/column-header'

import ContextActionMenu from '~/components/dashboard/lecture/context-action-menu'

export const columns: ColumnDef<Lecture>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'lectureId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'moduleId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Module ID" />
    ),
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    accessorFn: (row) => format(new Date(row.startTime), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    accessorKey: 'endTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    accessorFn: (row) => format(new Date(row.endTime), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const lecture = row.original

      return (
        <div className="flex flex-row gap-1">
          <ContextActionMenu lecture={lecture} />
        </div>
      )
    },
  },
]
