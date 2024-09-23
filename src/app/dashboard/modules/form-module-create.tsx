'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import Modal from '~/components/ui/modal'
import { toast } from '~/components/ui/use-toast'

import { api } from '~/lib/api'

// Schema for form validation (using Zod)
const formSchema = z.object({
  moduleId: z
    .string()
    .min(1, 'Required field')
    .max(10, 'Must be 15 characters or less')
    .startsWith('COMP', `Module ID must start with "COMP"`),
  moduleName: z.string().min(1),
  moduleDesc: z
    .string()
    .max(60, 'Description must be less than 60 characters')
    .nullish(), // nullish means it can be null or undefined
})

export default function AddModuleForm() {
  // Get current user's role
  const { data: userRole } = api.user.getUserRole.useQuery()

  // State - used to close dialog after an attendance record is added
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  // State - used for button loading spinners during attendance record creation and deletion
  const [isBeingAdded, setIsBeingAdded] = useState(false)

  // Used to refetch data after a module is added
  const { refetch } = api.module.getAllModules.useQuery()

  // Form hook - used for form validation and submission logic (using react-hook-form)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  // Form submission function - called when the form is submitted (using react-hook-form)
  function onSubmit(formData: z.infer<typeof formSchema>) {
    setIsBeingAdded(true)
    if (userRole === 'GUEST') {
      toast({
        title: '❌ Not allowed',
        description: 'Only admins can add new attendance records',
      })
      setIsBeingAdded(false)
      setDialogIsOpen(false)
      return
    }
    createNewModule({
      moduleId: formData.moduleId,
      moduleName: formData.moduleName,
      moduleDesc: formData.moduleDesc,
    })
  }

  // Creates a new module entry
  const { mutate: createNewModule } = api.module.createModule.useMutation({
    // Displays a toast notification when the mutation is successful
    onSuccess() {
      toast({
        title: 'Module Added ✅',
        description: `Module added to database successfully.`,
      })
      void refetch()
      setIsBeingAdded(false)
      setDialogIsOpen(false)
    },
    // Displays a toast notification when the mutation fails
    // TODO: Fetch error message from server and display it in the toast description
    onError(e) {
      setIsBeingAdded(false)
      console.log(e)
      toast({
        title: 'Error 😢',
        description: 'Something went wrong, please try again.',
      })
    },
  })

  return (
    <>
      {/* Modal - used to create new module */}
      <Modal open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <Modal.Trigger asChild>
          <Button>
            <Plus size={20} className="mr-2" />
            Add Module
          </Button>
        </Modal.Trigger>
        <Modal.Content title="Add a new module">
          <div className="mt-4 flex flex-col gap-4">
            {/* Form - to add new modules */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                        <Input
                          placeholder="Module Description"
                          {...field}
                          value={field.value ?? ''}
                        />
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
        </Modal.Content>
      </Modal>
    </>
  )
}
