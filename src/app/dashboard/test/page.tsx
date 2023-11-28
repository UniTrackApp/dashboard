'use client'

import { useState } from 'react'
import { Calendar } from '~/components/ui/calendar'
import { DateTimePicker } from '~/components/ui/date-time/date-time-picker'

export default function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div>
      <DateTimePicker granularity="minute" />
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </div>
  )
}
