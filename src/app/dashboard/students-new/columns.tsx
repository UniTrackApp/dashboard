'use client'

import { Student } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '~/components/ui/checkbox'
import { DataTableColumnHeader } from '~/components/ui/data-table/column-header'

import ContextActionMenu from '~/components/dashboard/students/context-action-menu'

export const columns: ColumnDef<Student>[] = [
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
    accessorKey: 'studentId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'studentCardId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Card ID" />
    ),
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const student = row.original

      return (
        <div className="flex flex-row gap-1">
          <ContextActionMenu student={student} />
        </div>
      )
    },
  },
]
