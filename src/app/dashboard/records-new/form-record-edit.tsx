'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Status } from '@prisma/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { api } from '~/app/trpc/react'
import { AttendanceRecordExtraInfo } from './columns'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useToast } from '~/components/ui/use-toast'

const formSchema = z.object({
  status: z.union([
    z.literal(Status.PRESENT),
    z.literal(Status.LATE),
    z.literal(Status.ABSENT),
  ]),
})

export default function EditAttendanceRecordForm({
  attendanceRecord,
  afterSave,
}: {
  attendanceRecord: AttendanceRecordExtraInfo
  afterSave: () => void
}) {
  const { toast } = useToast()
  const { mutate } = api.attendanceRecord.updateAttendanceRecord.useMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      {
        attendanceRecordId: attendanceRecord.attendanceRecordId,
        status: values.status,
      },
      {
        onSuccess(variables) {
          afterSave()
          toast({
            title: '✅ Successfully updated',
            description: <div>Changed status to {variables.status}</div>,
          })
        },
      },
    )
  }

  return (
    <>
      <h2 className="text-sm">Current Status: {attendanceRecord.status}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Selector - to edit attendance statuses */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent className="w-[300px]">
                      <SelectItem value={Status.PRESENT}>
                        {Status.PRESENT}
                      </SelectItem>
                      <SelectItem value={Status.LATE}>{Status.LATE}</SelectItem>
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}
