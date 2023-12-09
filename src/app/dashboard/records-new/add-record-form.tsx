/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Status } from '@prisma/client'
import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button, buttonVariants } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
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

import { toast } from '~/components/ui/use-toast'

import { api } from '~/lib/api'
import { cn } from '~/lib/utils'

// Schema for form validation (using Zod)
const FormSchema = z.object({
  studentId: z.string(),
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

export default function AddAttendanceRecordForm() {
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
    createAttendanceRecord({
      studentId: formData.studentId,
      lectureId: formData.lectureId,
      status: formData.status,
    })
  }

  // Used to fetch all students and lectures for the comboboxes
  const { data: allStudents } = api.student.getAllStudents.useQuery()
  const { data: allLectures } =
    api.lecture.getLectureIdsWithModuleNames.useQuery()

  // Creates a new attendance record entry
  const { mutate: createAttendanceRecord } =
    api.attendanceRecord.createAttendanceRecord.useMutation({
      // Displays a toast notification when the mutation is successful
      onSuccess() {
        toast({
          title: 'Attendance Record Added ✅',
          description: `Attendance record added to database successfully.`,
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
      {/* Dialog - used to create new Attendance Records */}
      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <DialogTrigger className={buttonVariants({ className: 'w-fit' })}>
          <Plus size={20} className="mr-2" />
          Add Record
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an attendance record</DialogTitle>
            <DialogDescription>
              <div className="mt-4 flex flex-col gap-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Combobox field - for Student ID */}
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Student ID</FormLabel>
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
                                  <CommandEmpty>
                                    No student ID found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {allStudents?.map((student) => (
                                      <CommandItem
                                        value={student.studentId}
                                        key={student.studentId}
                                        onSelect={() => {
                                          form.setValue(
                                            'studentId',
                                            student.studentId,
                                          )
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
                                          {student.studentId} -{' '}
                                          {student.firstName} {student.lastName}
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
                                  <CommandEmpty>
                                    No lecture ID found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {allLectures?.map((lecture) => (
                                      <CommandItem
                                        value={lecture.lectureId}
                                        key={lecture.lectureId}
                                        onSelect={() => {
                                          form.setValue(
                                            'lectureId',
                                            lecture.lectureId,
                                          )
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
                          <span>Add Record </span>
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
