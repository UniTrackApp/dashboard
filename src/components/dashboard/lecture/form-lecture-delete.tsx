'use client'

import { type Lecture } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { api } from '~/app/trpc/react'

import { Button } from '~/components/ui/button'
import { toast } from '~/components/ui/use-toast'

export default function DeleteLecture({
  lecture,
  closeModalAndDropdown,
}: {
  lecture: Lecture
  closeModalAndDropdown: () => void
}) {
  // Get current user's role
  const { data: userRole } = api.user.getUserRole.useQuery()

  // To refresh the page after a mutation
  const router = useRouter()

  // To delete a record by ID (using TRPC)
  const { mutate: deleteLectureById } =
    api.lecture.deleteLectureById.useMutation()

  return (
    <Button
      variant={'destructive'}
      onClick={() => {
        // Check if user is allowed to delete attendance records
        if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
          closeModalAndDropdown()
          toast({
            title: '❌ Not allowed',
            description: 'Only admins can delete attendance records',
          })
          return
        }

        // Delete the record if user is authorized
        deleteLectureById(
          {
            lectureId: lecture.lectureId,
          },
          {
            onSuccess: () => {
              router.refresh()
              closeModalAndDropdown()
              toast({
                title: '🗑️ Deleted',
                description: 'Attendance record deleted successfully',
              })
            },
            onError(error) {
              closeModalAndDropdown()
              toast({
                title: '❌ Error',
                description: error.message,
              })
            },
          },
        )
      }}
    >
      Delete
    </Button>
  )
}
