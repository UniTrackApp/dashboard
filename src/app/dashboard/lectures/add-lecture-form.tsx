/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { cn } from "~/utils/shadcn";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

// Schema for form validation (using Zod)
const FormSchema = z.object({
  lectureId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  moduleId: z.string(),
});

export default function AddModuleForm({
  createNewLecture,
  isBeingAdded,
  setIsBeingAdded,
}: {
  createNewLecture: (entry: z.infer<typeof FormSchema>) => void;
  isBeingAdded: boolean;
  setIsBeingAdded: (value: boolean) => void;
}) {
  // Form hook - used for form validation and submission logic (using react-hook-form)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Form submission function - called when the form is submitted (using react-hook-form)
  function onSubmit(formData: z.infer<typeof FormSchema>) {
    setIsBeingAdded(true);
    createNewLecture({
      lectureId: formData.lectureId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      moduleId: formData.moduleId,
    });
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a start time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="flex flex-col">
                <p className="text-amber-500">
                  NOTE: Temporarily hardcoded to use 00:00:00 as time
                </p>
              </FormDescription>
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a end time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="flex flex-col">
                <p className="text-amber-500">
                  NOTE: Temporarily hardcoded to use 00:00:00 as time
                </p>
              </FormDescription>
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
  );
}
