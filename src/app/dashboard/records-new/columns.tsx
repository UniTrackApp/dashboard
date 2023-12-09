'use client'

import { AttendanceRecord, Status } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { Badge } from '@radix-ui/themes'
import { Check, CheckCheck, X } from 'lucide-react'
import { Checkbox } from '~/components/ui/checkbox'
import { DataTableColumnHeader } from '~/components/ui/data-table/column-header'

import ContextActionMenu from './context-action-menu'

export type AttendanceRecordExtraInfo = AttendanceRecord & {
  Student: {
    firstName: string
    lastName: string
  }
  Lecture: {
    Module: {
      moduleName: string
    }
  }
}

export const columns: ColumnDef<AttendanceRecordExtraInfo>[] = [
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
    accessorKey: 'attendanceRecordId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'studentId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
  {
    accessorKey: 'Student',
    accessorFn: (row) => row.Student.firstName + ' ' + row.Student.lastName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
  },
  {
    accessorKey: 'Lecture',
    accessorFn: (row) => row.Lecture.Module.moduleName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Module Name" />
    ),
    cell: ({ row }) => {
      const moduleName = row.original.Lecture.Module.moduleName

      return (
        <Badge color="gray" variant="surface" radius="medium" size="1">
          {moduleName}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'lectureId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lecture ID" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status

      switch (status) {
        case Status.PRESENT:
          return (
            <Badge color="green" variant="soft">
              <CheckCheck className="h-4 w-4" />
              {status}
            </Badge>
          )
        case Status.LATE:
          return (
            <Badge color="yellow" variant="soft" radius="medium" size="1">
              <Check className="h-4 w-4" />
              {status}
            </Badge>
          )
        case Status.ABSENT:
          return (
            <Badge color="red" variant="soft" radius="medium" size="1">
              <X className="h-4 w-4" />
              {status}
            </Badge>
          )
      }
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timestamp" />
    ),
    accessorFn: (row) => format(new Date(row.timestamp), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const attendanceRecord = row.original

      return (
        <div className="flex flex-row gap-1">
          <ContextActionMenu attendanceRecord={attendanceRecord} />
        </div>
      )
    },
  },
]
