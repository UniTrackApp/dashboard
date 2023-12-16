/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
'use client'

import { CalendarIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import {
  useButton,
  useDatePicker,
  useInteractOutside,
  type DateValue,
} from 'react-aria'
import { useDatePickerState, type DatePickerStateOptions } from 'react-stately'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { DateField } from '@/components/ui/date-time/date-field'
import { TimeField } from '@/components/ui/date-time/time-field'

import { useForwardedRef } from '~/lib/useForwardedRef'
import { cn } from '~/lib/utils'
import { DateTimeCalendar } from './date-time-calendar'

const DateTimePicker = React.forwardRef<
  HTMLDivElement,
  DatePickerStateOptions<DateValue>
>((props, forwardedRef) => {
  const ref = useForwardedRef(forwardedRef)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const [open, setOpen] = useState(false)

  const state = useDatePickerState(props)
  const {
    groupProps,
    fieldProps,
    buttonProps: _buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(props, state, ref)
  const { buttonProps } = useButton(_buttonProps, buttonRef)
  useInteractOutside({
    ref: contentRef,
    onInteractOutside: (e) => {
      setOpen(false)
    },
  })

  return (
    <div
      {...groupProps}
      ref={ref}
      className={cn(
        groupProps.className,
        'flex items-center rounded-md ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      )}
    >
      <DateField {...fieldProps} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            {...buttonProps}
            variant="outline"
            className="rounded-l-none"
            disabled={props.isDisabled}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent ref={contentRef} className="w-full">
          <div {...dialogProps} className="space-y-3">
            <DateTimeCalendar {...calendarProps} />
            {!!state.hasTime && (
              <TimeField
                value={state.timeValue}
                onChange={state.setTimeValue}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
})

DateTimePicker.displayName = 'DateTimePicker'

export { DateTimePicker }
