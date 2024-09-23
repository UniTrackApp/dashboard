'use client'

import { type Module } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '~/components/ui/checkbox'
import { DataTableColumnHeader } from '~/components/ui/data-table/column-header'

import ContextActionMenu from './context-action-menu'

export const columns: ColumnDef<Module>[] = [
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
    accessorKey: 'moduleId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'moduleName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Module Name" />
    ),
  },
  {
    accessorKey: 'moduleDesc',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Module Description" />
    ),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const moduleInfo = row.original

      return (
        <div className="flex flex-row gap-1">
          <ContextActionMenu module={moduleInfo} />
        </div>
      )
    },
  },
]
