'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'

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

// Schema for form validation (using Zod)
const FormSchema = z.object({
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

export default function AddModuleForm({
  createNewLecture,
  isBeingAdded,
  setIsBeingAdded,
}: {
  createNewLecture: (entry: z.infer<typeof FormSchema>) => void
  isBeingAdded: boolean
  setIsBeingAdded: (value: boolean) => void
}) {
  // Form hook - used for form validation and submission logic (using react-hook-form)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  // Form submission function - called when the form is submitted (using react-hook-form)
  function onSubmit(formData: z.infer<typeof FormSchema>) {
    setIsBeingAdded(true)
    console.log('🎉 formData -> ', formData)
    createNewLecture({
      lectureId: formData.lectureId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      moduleId: formData.moduleId,
    })
  }

  return (
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
  )
}
