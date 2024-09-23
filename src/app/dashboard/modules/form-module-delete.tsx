'use client'

import { type Module } from '@prisma/client'
import { api } from '~/app/trpc/react'

import { Button } from '~/components/ui/button'
import { toast } from '~/components/ui/use-toast'

export default function DeleteModule({
  module,
  closeModalAndDropdown,
}: {
  module: Module
  closeModalAndDropdown: () => void
}) {
  // Get current user's role
  const { data: userRole } = api.user.getUserRole.useQuery()

  // Used to refetch data after a module is added
  const { refetch } = api.module.getAllModules.useQuery()

  // To delete a record by ID (using TRPC)
  const { mutate: deleteModuleById } = api.module.deleteModuleById.useMutation()

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
        deleteModuleById(
          {
            moduleId: module.moduleId,
          },
          {
            onSuccess: () => {
              void refetch()
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
