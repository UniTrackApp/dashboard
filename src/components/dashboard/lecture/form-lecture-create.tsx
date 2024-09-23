'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '~/components/ui/button'
import { DateTimePicker } from '~/components/ui/date-time/date-time-picker'
import {
  Form,
  FormControl,
  FormDescription,
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
import { LectureSchemaCreate } from '~/types/schemas'

export default function AddLectureForm() {
  // Get current user's role
  const { data: userRole } = api.user.getUserRole.useQuery()

  // State - used to close dialog after an attendance record is added
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  // State - used for button loading spinners during attendance record creation and deletion
  const [isBeingAdded, setIsBeingAdded] = useState(false)

  // Used to refresh the page data after an attendance record is added (since page is a Server Component)
  const router = useRouter()

  // Form hook - used for form validation and submission logic (using react-hook-form)
  const form = useForm<z.infer<typeof LectureSchemaCreate>>({
    resolver: zodResolver(LectureSchemaCreate),
  })

  // Form submission function - called when the form is submitted (using react-hook-form)
  function onSubmit(formData: z.infer<typeof LectureSchemaCreate>) {
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
    createNewLecture({
      lectureId: formData.lectureId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      moduleId: formData.moduleId,
    })
  }

  // Creates a new student entry
  const { mutate: createNewLecture } = api.lecture.createLecture.useMutation({
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
      setIsBeingAdded(false)
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
            Add Lecture
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
                {/* Input field - for Lecture ID */}
                <FormField
                  control={form.control}
                  name="lectureId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Lecture ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Lecture ID" {...field} />
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
                        <Input placeholder="Module ID" {...field} />
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
                        onChange={(value) => {
                          field.onChange(value.toDate('Europe/London'))
                        }}
                      />
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
                      <span>Add Lecture</span>
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
