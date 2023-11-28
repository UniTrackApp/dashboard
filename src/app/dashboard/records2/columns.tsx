'use client'

import { AttendanceRecord } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

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

export const columns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: 'attendanceRecordId',
    header: 'Attendance Record ID',
  },
  {
    accessorKey: 'studentId',
    header: 'Student ID',
  },
  {
    accessorKey: 'lectureId',
    header: 'Lecture ID',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    accessorFn: (row) => format(new Date(row.timestamp), 'dd/MM/yyyy HH:mm:ss'),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const payment = row.original

      const { mutate: deleteAttendanceRecordById } =
        api.attendanceRecord.deleteAttendanceRecordById.useMutation({
          onSuccess: () => {
            console.log('✅ Successfully deleted attendance record')
            revalidatePath('/dashboard/records2')
          },
        })

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(payment.attendanceRecordId)
              }
            >
              Copy attendance ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="#" className="flex">
                <ExternalLink className="mr-2 h-4 w-4" />
                View info
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Not implemented yet')}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                deleteAttendanceRecordById({
                  attendanceRecordId: row.original.attendanceRecordId,
                })
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
