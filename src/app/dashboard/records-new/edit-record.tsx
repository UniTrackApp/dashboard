'use client'

import { Status } from '@prisma/client'
import { AttendanceRecordExtraInfo } from './columns'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { api } from '~/app/trpc/react'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useToast } from '~/components/ui/use-toast'

function EditAttendanceRecordCard() {}

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
        onSuccess(data, variables, context) {
          console.log('😈 data', data)
          console.log('😈 variables', variables)
          console.log('😈 context', context)

          afterSave()

          toast({
            title: '✅ Successfully updated',
            description: `Changed status to ${variables.status}`,
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
