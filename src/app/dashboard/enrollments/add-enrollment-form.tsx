/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { api } from "~/lib/api";
import { cn } from "~/lib/utils";

// Schema for form validation (using Zod)
const FormSchema = z.object({
  studentId: z
    .string()
    .min(1, "Required field")
    .max(10, "Must be 10 characters or less")
    .regex(/^[0-9]+$/, "Must be a number"),
  moduleId: z
    .string()
    .min(1, "Required field")
    .max(10, "Must be 15 characters or less")
    .startsWith("COMP", `Module ID must start with "COMP"`),
});

export default function AddEnrollmentForm({
  createEnrollment,
  isBeingAdded,
  setIsBeingAdded,
}: {
  createEnrollment: (entry: z.infer<typeof FormSchema>) => void;
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
    createEnrollment({
      studentId: formData.studentId,
      moduleId: formData.moduleId,
    });
  }

  // Used to fetch all students and lectures for the comboboxes
  const { data: allStudents } = api.student.getAllStudents.useQuery();
  const { data: getAllModules } = api.module.getAllModules.useQuery();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          "w-[300px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? allStudents?.find(
                              (student) => student.studentId === field.value,
                            )?.studentId
                          : "Select student ID"}
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
                              form.setValue("studentId", student.studentId);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                student.studentId === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <span className="truncate tabular-nums">
                              {student.studentId} - {student.firstName}{" "}
                              {student.lastName}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>Open to view autocompletions...</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Combobox field - for Module ID */}
        <FormField
          control={form.control}
          name="moduleId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Module ID</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[300px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? getAllModules?.find(
                              (module) => module.moduleId === field.value,
                            )?.moduleId
                          : "Select module ID"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search module IDs..." />
                      <CommandEmpty>No module ID found.</CommandEmpty>
                      <CommandGroup>
                        {getAllModules?.map((module) => (
                          <CommandItem
                            value={module.moduleId}
                            key={module.moduleId}
                            onSelect={() => {
                              form.setValue("moduleId", module.moduleId);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                module.moduleId === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <span className="truncate tabular-nums">
                              {module.moduleId} - {module.moduleName}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>Open to view autocompletions...</FormDescription>
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
              <span>Create enrollment</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
