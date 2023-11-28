'use client'

import { useState } from 'react'

import ModuleTable from '@/app/dashboard/modules/module-table'
import { buttonVariants } from '@/components/ui/button'

import { Badge, Card, Flex, Title } from '@tremor/react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { toast } from '~/components/ui/use-toast'
import { api } from '~/lib/api'
import AddModuleForm from './add-module-form'

export default function Modules() {
  // State - used for button loading spinners during module creation and deletion
  const [idBeingDeleted, setIdBeingDeleted] = useState<string | null>(null)
  const [isBeingAdded, setIsBeingAdded] = useState(false)

  // State - used to close dialog after a module is added
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  // Fetches all modules, and refetches when createNewModule is called
  const {
    data: allModules,
    refetch: refetchAllModules,
    isLoading: isLoadingAllModules,
  } = api.module.getAllModules.useQuery()

  // Fetches module count and refetches when createNewModule is called
  const {
    data: moduleCount,
    refetch: refetchModuleCount,
    isLoading: isLoadingModuleCount,
  } = api.module.getModuleCount.useQuery()

  // Creates a new module entry
  const { mutate: createModule } = api.module.createModule.useMutation({
    // Displays a toast notification when the mutation is successful
    onSuccess() {
      toast({
        title: 'Module Added ✅',
        description: `Module added to database successfully.`,
      })
      void refetchAllModules()
      void refetchModuleCount()
      setIsBeingAdded(false)
      setDialogIsOpen(false)
    },
    // Displays a toast notification when the mutation fails
    // TODO: Fetch error message from server and display it in the toast description
    onError() {
      toast({
        title: 'Error 😢',
        description: 'Something went wrong, please try again.',
      })
    },
  })

  // Deletes a module by ID
  const { mutate: deleteModuleById } = api.module.deleteModuleById.useMutation({
    // Displays a toast notification when the mutation is successful
    onSuccess() {
      toast({
        title: 'Module Deleted ✅',
        description: 'Module deleted from database successfully.',
      })
      void refetchAllModules()
      void refetchModuleCount()
      setIdBeingDeleted(null)
    },
    // Displays a toast notification when the mutation fails
    // TODO: Fetch error message from server and display it in the toast description
    onError() {
      toast({
        title: 'Error 😢',
        description: 'Something went wrong, please try again.',
      })
    },
  })

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Modules</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Manage all modules here. A module can have multiple lectures.
        </p>
        <Separator className="my-6" />
      </div>

      {/* Card - Contains table and button to add new modules */}
      <Card>
        {/* Card Title - displays table name + item counts */}
        <Flex justifyContent="between">
          <Flex justifyContent="start" className="gap-2">
            <Title>Modules</Title>
            {isLoadingModuleCount && (
              <Skeleton className="h-[25px] w-[35px] rounded-full" />
            )}
            {moduleCount && <Badge color="blue">{moduleCount}</Badge>}
          </Flex>

          {/* Dialog - used to create new modules */}
          <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger className={buttonVariants({ className: 'w-fit' })}>
              <Plus size={20} className="mr-2" />
              Create Module
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new module</DialogTitle>
                <DialogDescription>
                  <div className="mt-4 flex flex-col gap-4">
                    <AddModuleForm
                      createModule={createModule}
                      isBeingAdded={isBeingAdded}
                      setIsBeingAdded={setIsBeingAdded}
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </Flex>

        {/* Table - to display all modules */}
        {isLoadingAllModules && (
          <div className="mt-4 flex flex-col gap-4">
            <Skeleton className="h-[35px] w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        )}
        {allModules && (
          <ModuleTable
            allModules={allModules}
            deleteModuleById={deleteModuleById}
            idBeingDeleted={idBeingDeleted}
            setIdBeingDeleted={setIdBeingDeleted}
          />
        )}
      </Card>
    </>
  )
}
