import {
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '~/app/trpc/react'

import { AttendanceRecordExtraInfo } from '~/app/dashboard/records-new/columns'
import EditAttendanceRecordForm from '~/app/dashboard/records-new/form-record-edit'

import Link from 'next/link'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import Modal from '~/components/ui/modal'

export default function ContextActionMenu({
  attendanceRecord,
}: {
  attendanceRecord: AttendanceRecordExtraInfo
}) {
  // State - to manage the open/close state of the modals and dropdown
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)

  // To refresh the page after a mutation
  const { refresh } = useRouter()

  // To delete a record by ID (using TRPC)
  const { mutate: deleteAttendanceRecordById } =
    api.attendanceRecord.deleteAttendanceRecordById.useMutation({
      onSuccess: () => {
        refresh()
      },
    })

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {/* Dropdown Menu Content - This is where all buttons and their actions will be */}
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            navigator.clipboard.writeText(attendanceRecord.attendanceRecordId)
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

        {/* Modal - to edit records */}
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
                Proceed with caution when manually editing an attendance record
                as there could be unintended consequences.
              </Modal.Description>
            </Modal.Header>
            <EditAttendanceRecordForm
              attendanceRecord={attendanceRecord}
              afterSave={() => {
                setOpenEditModal(false)
                setOpenDropdown(false)
                refresh()
              }}
            />
          </Modal.Content>
        </Modal>

        <DropdownMenuSeparator />

        {/* Modal - to delete records */}
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
                    attendanceRecordId: attendanceRecord.attendanceRecordId,
                  })
                  setOpenDeleteModal(false)
                  setOpenDropdown(false)
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
