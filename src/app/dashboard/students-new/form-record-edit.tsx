'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type Student } from '@prisma/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { api } from '~/app/trpc/react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useToast } from '~/components/ui/use-toast'

const formSchema = z.object({
  studentId: z
    .string()
    .max(10, 'Must be 10 characters or less')
    .regex(/^[0-9]+$/, 'Must be a number')
    .optional(),
  studentCardId: z
    .string()
    .toUpperCase()
    .max(50, 'Must be 50 characters or less')
    .optional(),

  firstName: z.string().max(50, 'Must be 50 characters or less').optional(),

  lastName: z.string().max(50, 'Must be 50 characters or less').optional(),
})

export default function EditStudentForm({
  student,
  closeModalAndDropdown,
}: {
  student: Student
  closeModalAndDropdown: () => void
}) {
  // Get current user's role from database
  const { data: userRole } = api.user.getUserRole.useQuery()

  // To refresh the page after a mutation
  const router = useRouter()

  // To display toast messages
  const { toast } = useToast()

  // Mutation function to update attendance records (using TRPC)
  const { mutate: updateStudent } = api.student.updateStudent.useMutation()

  // Function to update attendance records if user is authorized
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if user is allowed to update attendance records
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      closeModalAndDropdown()
      toast({
        title: '❌ Not allowed',
        description: 'Only admins can edit attendance records',
      })
      return
    }

    // Update the record if user is authorized
    updateStudent(
      {
        currentStudentId: student.studentId, // This is the ID of the record to be updated
        updatedStudentId: values.studentId, // This is the new ID, if provided
        studentCardId: values.studentCardId,
        firstName: values.firstName,
        lastName: values.lastName,
      },
      {
        onSuccess() {
          router.refresh()
          closeModalAndDropdown()
          toast({
            title: '✅ Successfully updated',
            description: 'Student record has been updated',
          })
        },
        onError(error) {
          toast({
            title: '❌ Error',
            description: error.message,
          })
        },
      },
    )
  }

  // Form definition using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <>
      {/* Form - to edit attendance records */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Input field - for first name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    defaultValue={student.firstName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for last name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    defaultValue={student.lastName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for student ID */}
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Student ID"
                    defaultValue={student.studentId}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for student card ID */}
          <FormField
            control={form.control}
            name="studentCardId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Student Card ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Student Card ID"
                    defaultValue={student.studentCardId}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button - uses state for loading spinner */}
          <Button type="submit">
            <>
              <Check className="mr-2 h-4 w-4" />
              <span>Save changes</span>
            </>
          </Button>
        </form>
      </Form>
    </>
  )
}
