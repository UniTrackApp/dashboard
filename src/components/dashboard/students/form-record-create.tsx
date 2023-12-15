'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import Modal from '~/components/ui/modal'
import { toast } from '~/components/ui/use-toast'

import { api } from '~/lib/api'

// Schema for form validation (using Zod)
const FormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Required field')
    .max(50, 'Must be 50 characters or less'),
  lastName: z
    .string()
    .min(1, 'Required field')
    .max(50, 'Must be 50 characters or less'),
  studentId: z
    .string()
    .min(1, 'Required field')
    .max(10, 'Must be 10 characters or less')
    .regex(/^[0-9]+$/, 'Must be a number'),
  studentCardId: z
    .string()
    .toUpperCase()
    .min(1, 'Required field')
    .max(50, 'Must be 50 characters or less'),
})

export default function AddStudentForm() {
  // Get current user's role
  const { data: userRole } = api.user.getUserRole.useQuery()

  // State - used to close dialog after an attendance record is added
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  // State - used for button loading spinners during attendance record creation and deletion
  const [isBeingAdded, setIsBeingAdded] = useState(false)

  // Used to refresh the page data after an attendance record is added (since page is a Server Component)
  const router = useRouter()

  // Form hook - used for form validation and submission logic (using react-hook-form)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  // Form submission function - called when the form is submitted (using react-hook-form)
  function onSubmit(formData: z.infer<typeof FormSchema>) {
    setIsBeingAdded(true)
    if (userRole === 'GUEST') {
      toast({
        title: '❌ Not allowed',
        description: 'Only admins can add new attendance records',
      })
      setIsBeingAdded(false)
      setDialogIsOpen(false)
      return
    }
    createStudent({
      studentId: formData.studentId,
      studentCardId: formData.studentCardId,
      firstName: formData.firstName,
      lastName: formData.lastName,
    })
  }

  // Creates a new student entry
  const { mutate: createStudent } = api.student.createStudent.useMutation({
    // Displays a toast notification when the mutation is successful
    onSuccess() {
      toast({
        title: 'Student Added ✅',
        description: `Student added to database successfully.`,
      })
      router.refresh()
      setIsBeingAdded(false)
      setDialogIsOpen(false)
    },
    // Displays a toast notification when the mutation fails
    // TODO: Fetch error message from server and display it in the toast description
    onError(e) {
      console.log(e)
      toast({
        title: 'Error 😢',
        description: 'Something went wrong, please try again.',
      })
    },
  })

  return (
    <>
      {/* Modal - used to create new students */}
      <Modal open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <Modal.Trigger asChild>
          <Button>
            <Plus size={20} className="mr-2" />
            Add Student
          </Button>
        </Modal.Trigger>
        <Modal.Content title="Add an attendance record">
          <div className="mt-4 flex flex-col gap-4">
            {/* Form - to add new attendance records */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Input field - for first name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
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
                        <Input placeholder="Last Name" {...field} />
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
                        <Input placeholder="Student ID" {...field} />
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
                        <Input placeholder="Student Card ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit button - uses state for loading spinner */}
                <Button type="submit" disabled={isBeingAdded}>
                  {isBeingAdded && (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  )}

                  {!isBeingAdded && (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Add Module</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}
