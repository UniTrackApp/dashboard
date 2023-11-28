'use client'

import { UserPlus2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '~/components/ui/use-toast'
import { api } from '~/lib/api'

import { Badge, Card, Title } from '@tremor/react'
import { buttonVariants } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import AddStudentForm from './add-student-form'
import StudentTable from './student-table'

export default function Students() {
  const { toast } = useToast()

  const [isBeingDeleted, setIsBeingDeleted] = useState<string | null>(null)
  const [isBeingAdded, setIsBeingAdded] = useState(false)

  // State - used to close dialog after an attendance record is added
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  const {
    data: allStudentsInfo,
    refetch: refetchAllStudents,
    isLoading: isloadingAllStudents,
  } = api.student.getAllStudents.useQuery()

  const {
    data: studentCount,
    refetch: refetchStudentCount,
    isLoading: isLoadingStudentCount,
  } = api.student.getStudentCount.useQuery()

  const { mutate: createStudent } = api.student.createStudent.useMutation({
    onSuccess({ firstName, studentId }) {
      toast({
        title: 'Student Added ✅',
        description: `${firstName} (${studentId}) has been added to the database.`,
      })
      void refetchAllStudents()
      void refetchStudentCount()
      setIsBeingAdded(false)
      setDialogIsOpen(false)
    },
    onError({ data }) {
      console.log(data)
      toast({
        title: 'Error 😢',
        description: 'Something went wrong, please try again.',
      })
    },
  })

  const { mutate: deleteStudentById } =
    api.student.deleteStudentById.useMutation({
      onSuccess({ firstName }) {
        toast({
          title: 'Student Deleted ❌',
          description: `${firstName} has been deleted from the database.`,
        })
        void refetchAllStudents()
        void refetchStudentCount()
        setIsBeingDeleted(null)
      },
      onError() {
        toast({
          title: 'Error 😢',
          description: 'Something went wrong, please try again.',
        })
      },
    })

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Students</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your student data here. Only students enrolled in a module will
          be able to have attendance records.
        </p>
        <Separator className="my-6" />
      </div>

      {/* Card - Contains table and button to add new students */}
      <Card className="pb-2">
        {/* Card Title - displays table name + item counts */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Title>Students</Title>
            {isLoadingStudentCount && (
              <Skeleton className="h-[25px] w-[35px] rounded-full" />
            )}
            {studentCount && <Badge color="blue">{studentCount}</Badge>}
          </div>

          {/* Button - to add new students */}
          <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger
              className={buttonVariants({
                variant: 'default',
                className: 'w-fit',
              })}
            >
              <UserPlus2 className="mr-2" />
              Add Student
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register a student</DialogTitle>
                <DialogDescription>
                  {/* Form - Student Registration */}
                  <AddStudentForm
                    createStudent={createStudent}
                    isBeingAdded={isBeingAdded}
                    setIsBeingAdded={setIsBeingAdded}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table - to view all students data */}
        {isloadingAllStudents && (
          <div className="mt-4 flex flex-col gap-4">
            <Skeleton className="h-[35px] w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        )}
        {!!allStudentsInfo && (
          <StudentTable
            allStudentsInfo={allStudentsInfo}
            deleteStudentById={deleteStudentById}
            isBeingDeleted={isBeingDeleted}
            setIsBeingDeleted={setIsBeingDeleted}
          />
        )}
      </Card>
    </>
  )
}
