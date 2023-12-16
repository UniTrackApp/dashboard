'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type Lecture } from '@prisma/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { api } from '~/app/trpc/react'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { parseDateTime } from '@internationalized/date'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { DateTimePicker } from '~/components/ui/date-time/date-time-picker'
import { Input } from '~/components/ui/input'
import { useToast } from '~/components/ui/use-toast'

// Schema for form validation (using Zod)
const formSchema = z.object({
  lectureId: z
    .string()
    .min(1, 'Required field')
    .max(20, 'Must be 20 characters or less')
    .startsWith('COMP', `Lecture ID must start with "COMP"`),
  moduleId: z
    .string()
    .min(1, 'Required field')
    .max(10, 'Must be 15 characters or less')
    .startsWith('COMP', `Module ID must start with "COMP"`),
  startTime: z.date(),
  endTime: z.date(),
})

export default function EditLectureForm({
  lecture,
  closeModalAndDropdown,
}: {
  lecture: Lecture
  closeModalAndDropdown: () => void
}) {
  // Get current user's role from database
  const { data: userRole } = api.user.getUserRole.useQuery()

  // To refresh the page after a mutation
  const router = useRouter()

  // To display toast messages
  const { toast } = useToast()

  // Mutation function to update attendance records (using TRPC)
  const { mutate: updateLecture } = api.lecture.updateLecture.useMutation()

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
    updateLecture(
      {
        currentLectureId: lecture.lectureId, // ID of the record to be updated
        updatedLectureId: values.lectureId, // New ID of the record
        startTime: values.startTime,
        endTime: values.endTime,
        moduleId: values.moduleId,
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
          {/* Input field - for Lecture ID */}
          <FormField
            control={form.control}
            name="lectureId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Lecture ID</FormLabel>
                <FormControl>
                  <Input defaultValue={lecture.lectureId} {...field} />
                </FormControl>
                <FormDescription className="flex flex-col">
                  <p>{`IDs should be in this format: COMP101-W01`}</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for Module ID */}
          <FormField
            control={form.control}
            name="moduleId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Module ID</FormLabel>
                <FormControl>
                  <Input defaultValue={lecture.moduleId} {...field} />
                </FormControl>
                <FormDescription className="flex flex-col">
                  <p>Must be an existing module&apos;s ID</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for lecture start time */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Time</FormLabel>
                <DateTimePicker
                  granularity="minute"
                  defaultValue={parseDateTime(
                    format(lecture.startTime, "yyyy-MM-dd'T'HH:mm"),
                  )}
                  onChange={(value) => {
                    field.onChange(value.toDate('Europe/London'))
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for lecture start time */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Time</FormLabel>
                <DateTimePicker
                  granularity="minute"
                  defaultValue={parseDateTime(
                    format(lecture.endTime, "yyyy-MM-dd'T'HH:mm"),
                  )}
                  onChange={(value) => {
                    field.onChange(value.toDate('Europe/London'))
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button - uses state for loading spinner */}
          <Button type="submit">
            <>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Lecture</span>
            </>
          </Button>
        </form>
      </Form>
    </>
  )
}
