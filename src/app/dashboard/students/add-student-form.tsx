import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { Loader2, Plus } from "lucide-react";

// Schema for form validation (using Zod)
const FormSchema = z.object({
  firstName: z
    .string()
    .min(1, "Required field")
    .max(50, "Must be 50 characters or less"),
  lastName: z
    .string()
    .min(1, "Required field")
    .max(50, "Must be 50 characters or less"),
  studentId: z
    .string()
    .min(1, "Required field")
    .max(10, "Must be 10 characters or less")
    .regex(/^[0-9]+$/, "Must be a number"),
  studentCardId: z
    .string()
    .min(1, "Required field")
    .max(50, "Must be 50 characters or less"),
});

export default function AddStudentForm({
  createStudent,
  isBeingAdded,
  setIsBeingAdded,
}: {
  createStudent: (entry: z.infer<typeof FormSchema>) => void;
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
    createStudent({
      firstName: formData.firstName,
      lastName: formData.lastName,
      studentId: formData.studentId,
      studentCardId: formData.studentCardId,
    });
  }

  return (
    <div className="mt-4 flex flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Input field - for first name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for last name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for student ID */}
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="Student ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input field - for student card ID */}
          <FormField
            control={form.control}
            name="studentCardId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Student Card ID</FormLabel>
                <FormControl>
                  <Input placeholder="Student Card ID" {...field} />
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
                <span>Add Module</span>
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
