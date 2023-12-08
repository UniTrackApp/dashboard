'use client'

import { AttendanceRecord, Status } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  Check,
  CheckCheck,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { api } from '~/app/trpc/react'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@radix-ui/themes'
import { DataTableColumnHeader } from '~/components/ui/data-table/column-header'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Modal from '~/components/ui/modal'
import EditAttendanceRecordForm from './edit-record'

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

      const [openEditModal, setOpenEditModal] = useState(false)
      const [openDeleteModal, setOpenDeleteModal] = useState(false)
      const [openDropdown, setOpenDropdown] = useState(false)

      const { refresh } = useRouter()

      const { mutate: deleteAttendanceRecordById } =
        api.attendanceRecord.deleteAttendanceRecordById.useMutation({
          onSuccess: () => {
            refresh()
          },
        })

      return (
        <div className="flex flex-row gap-1">
          <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  navigator.clipboard.writeText(
                    attendanceRecord.attendanceRecordId,
                  )
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="#" className="flex cursor-not-allowed">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View info
                </Link>
              </DropdownMenuItem>

              <Modal open={openEditModal} onOpenChange={setOpenEditModal}>
                <Modal.Trigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </Modal.Trigger>
                <Modal.Content title="Edit record">
                  <Modal.Header>
                    <Modal.Description>
                      Proceed with caution when manually editing an attendance
                      record as there could be unintended consequences.
                    </Modal.Description>
                  </Modal.Header>
                  <EditAttendanceRecordForm
                    attendanceRecord={attendanceRecord}
                    afterSave={() => {
                      setOpenEditModal(false)
                      refresh()
                      setOpenDropdown(false)
                    }}
                  />
                </Modal.Content>
              </Modal>

              <DropdownMenuSeparator />

              <Modal open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                <Modal.Trigger asChild>
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </Modal.Trigger>
                <Modal.Content title="Delete record">
                  <Modal.Header>
                    <Modal.Description>
                      Are you sure you want to delete this record?
                    </Modal.Description>
                  </Modal.Header>
                  <Modal.Footer>
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        deleteAttendanceRecordById({
                          attendanceRecordId: row.original.attendanceRecordId,
                        })
                        setOpenDeleteModal(false)
                      }}
                    >
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
