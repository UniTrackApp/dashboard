'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Status } from '@prisma/client'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

import { api } from '~/lib/api'
import { cn } from '~/lib/utils'

// Schema for form validation (using Zod)
const FormSchema = z.object({
  attendanceRecordId: z.string(),
  lectureId: z
    .string()
    .min(1, 'Required field')
    .max(20, 'Must be 20 characters or less')
    .startsWith('COMP', `Lecture ID must start with "COMP"`),
  status: z.union([
    z.literal(Status.PRESENT),
    z.literal(Status.LATE),
    z.literal(Status.ABSENT),
  ]),
})

export default function IndividualStudentPage({
  params,
}: {
  params: { id: string }
}) {
  const { data, isLoading } =
    api.attendanceRecord.getAttendanceRecordById.useQuery({
      attendanceRecordId: params.id,
    })

  const { mutate } = api.attendanceRecord.updateAttendanceRecord.useMutation()

  // Form hook - used for form validation and submission logic (using react-hook-form)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  // Form submission function - called when the form is submitted (using react-hook-form)
  function onSubmit(formData: z.infer<typeof FormSchema>) {
    // mutate({
    //   attendanceRecordId: formData.attendanceRecordId,
    //   status: formData.status,
    // })
    console.log(formData)
  }

  // Used to fetch all students and lectures for the comboboxes
  const { data: allStudents } = api.student.getAllStudents.useQuery()
  const { data: allLectures } =
    api.lecture.getLectureIdsWithModuleNames.useQuery()

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Edit Record</h1>
      {!!isLoading && <p>Loading...</p>}
      {!!data && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {/* Combobox field - for attendance record ID */}
            <FormField
              control={form.control}
              name="attendanceRecordId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Attendance Record ID</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-[300px] justify-between',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? allStudents?.find(
                                  (student) =>
                                    student.studentId === field.value,
                                )?.studentId
                              : 'Select student ID'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search student IDs..." />
                          <CommandEmpty>No student ID found.</CommandEmpty>
                          <CommandGroup>
                            {allStudents?.map((student) => (
                              <CommandItem
                                value={student.studentId}
                                key={student.studentId}
                                onSelect={() => {
                                  form.setValue('studentId', student.studentId)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    student.studentId === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <span className="truncate tabular-nums">
                                  {student.studentId} - {student.firstName}{' '}
                                  {student.lastName}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    Open to view autocompletions...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Combobox field - for Lecture ID */}
            <FormField
              control={form.control}
              name="lectureId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Lecture ID</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-[300px] justify-between',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? allLectures?.find(
                                  (lecture) =>
                                    lecture.lectureId === field.value,
                                )?.lectureId
                              : 'Select lecture ID'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search lecture IDs..." />
                          <CommandEmpty>No lecture ID found.</CommandEmpty>
                          <CommandGroup>
                            {allLectures?.map((lecture) => (
                              <CommandItem
                                value={lecture.lectureId}
                                key={lecture.lectureId}
                                onSelect={() => {
                                  form.setValue('lectureId', lecture.lectureId)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    lecture.lectureId === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <span className="truncate tabular-nums">
                                  {lecture.lectureId} -{' '}
                                  {lecture.Module.moduleName}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    Open to view autocompletions...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select selector - for attendance status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-[300px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[300px]">
                        <SelectItem value={Status.PRESENT}>
                          {Status.PRESENT}
                        </SelectItem>
                        <SelectItem value={Status.LATE}>
                          {Status.LATE}
                        </SelectItem>
                        <SelectItem value={Status.ABSENT}>
                          {Status.ABSENT}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit button - uses state for loading spinner */}
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Record </span>
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
