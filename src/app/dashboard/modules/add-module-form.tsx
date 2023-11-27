/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
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

// Schema for form validation (using Zod)
const FormSchema = z.object({
  moduleId: z
    .string()
    .min(1, "Must be at least 1 character")
    .max(10, "Must be 15 characters or less")
    .startsWith("COMP", `Module ID must start with "COMP"`),
  moduleName: z.string().min(1),
  moduleDesc: z
    .string()
    .max(60, "Description must be less than 60 characters")
    .optional(), // Optional field
});

export default function AddModuleForm({
  createModule,
  isBeingAdded,
  setIsBeingAdded,
}: {
  createModule: (entry: z.infer<typeof FormSchema>) => void;
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
    createModule({
      moduleId: formData.moduleId,
      moduleName: formData.moduleName,
      moduleDesc: formData.moduleDesc,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormDescription>
                {`ModuleIDs must start with "COMP"`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input field - for Module Name */}
        <FormField
          control={form.control}
          name="moduleName"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Module Name</FormLabel>
              <FormControl>
                <Input placeholder="Module Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input field - for Module Description */}
        <FormField
          control={form.control}
          name="moduleDesc"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Module Description</FormLabel>
              <FormControl>
                <Input placeholder="Module Name" {...field} />
              </FormControl>
              <FormDescription>
                Optional field, leave blank if not needed.
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
              <span>Add Module</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
