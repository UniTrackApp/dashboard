import { type Lecture } from '@prisma/client'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from '~/app/trpc/react'
import { Button } from '~/components/ui/button'
import { toast as displayToast } from '~/components/ui/use-toast'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
}

export default function DeleteSelectedLectures<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  // Get current user's role
  const { data: userRole } = api.user.getUserRole.useQuery()

  // To refresh the page after a mutation
  const { refresh: refreshPageData } = useRouter()

  // Mutation function to delete multiple selected records from the table (using TRPC)
  const { mutate: deleteLecturesByIds } =
    api.lecture.deleteLecturesByIds.useMutation()

  return (
    <>
      {table.getSelectedRowModel().rows.length !== 0 && (
        <>
          {/* Button - To delete multiple selected records */}
          <Button
            variant={'destructive'}
            onClick={() => {
              // Check if user is allowed to delete attendance records
              if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
                displayToast({
                  title: '❌ Not allowed',
                  description: 'Only admins can delete attendance records',
                })
                return
              }

              // Delete multiple selected records if user is authorized
              deleteLecturesByIds(
                {
                  lectureIds: table
                    .getSelectedRowModel()
                    .rows.map((row) => (row.original as Lecture).lectureId),
                },
                {
                  onSuccess(data) {
                    refreshPageData()
                    displayToast({
                      title: '🗑️ Deleted',
                      description: `${data.count} selected attendance records deleted successfully`,
                    })
                  },
                  onError(error) {
                    displayToast({
                      title: '❌ Error',
                      description: error.message,
                    })
                  },
                },
              )
            }}
          >
            <Trash2 size={20} className="mr-2" />
            Delete Selected
          </Button>
        </>
      )}
    </>
  )
}
