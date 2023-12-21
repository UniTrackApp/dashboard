'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type Module } from '@prisma/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { api } from '~/app/trpc/react'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Check, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useToast } from '~/components/ui/use-toast'

// Schema for form validation (using Zod)
const formSchema = z.object({
  moduleId: z
    .string()
    .max(10, 'Must be 15 characters or less')
    .startsWith('COMP', `Module ID must start with "COMP"`)
    .optional(),
  moduleName: z.string().optional(),
  moduleDesc: z
    .string()
    .max(60, 'Description must be less than 60 characters')
    .optional()
    .nullish(), // nullish means it can be null or undefined
})

export default function EditModuleForm({
  module,
  closeModalAndDropdown,
}: {
  module: Module
  closeModalAndDropdown: () => void
}) {
  // Get current user's role from database
  const { data: userRole } = api.user.getUserRole.useQuery()

  // Used to refetch data after a module is added
  const { refetch } = api.module.getAllModules.useQuery()

  // To display toast messages
  const { toast } = useToast()

  // Mutation function to update attendance records (using TRPC)
  const { mutate: updateModule } = api.module.updateModule.useMutation()

  // Function to update attendance records if user is authorized
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if user is allowed to update attendance records
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      closeModalAndDropdown()
      toast({
        title: '❌ Not allowed',
        description: 'Only admins can edit attendance records',
      })
      return
    }

    // Update the record if user is authorized
    updateModule(
      {
        currentModuleId: module.moduleId, // ID of the record to be updated
        updatedModuleId: values.moduleId, // New ID of the record
        moduleName: values.moduleName,
        moduleDesc: values.moduleDesc,
      },
      {
        onSuccess() {
          void refetch()
          closeModalAndDropdown()
          toast({
            title: '✅ Successfully updated',
            description: 'Module has been updated',
          })
        },
        onError(error) {
          toast({
            title: '❌ Error',
            description: error.message,
          })
        },
      },
    )
  }

  // Form definition using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <>
      {/* Form - to edit attendance records */}
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
                  <Input defaultValue={module.moduleId} {...field} />
                </FormControl>
                <FormDescription className="flex flex-col">
                  <p>{`IDs should be in this format: COMP101`}</p>
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
                <FormLabel>Module ID</FormLabel>
                <FormControl>
                  <Input defaultValue={module.moduleName} {...field} />
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
                  <Input
                    defaultValue={module.moduleDesc ?? ''}
                    {...field}
                    value={field.value === null ? '' : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button - uses state for loading spinner */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant={'ghost'}
              onClick={() => {
                closeModalAndDropdown()
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <>
                <Check className="mr-2 h-4 w-4" />
                <span>Save changes</span>
              </>
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
