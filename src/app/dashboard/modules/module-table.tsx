import { type Module } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react'
import {
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

export default function ModuleTable({
  allModules,
  deleteModuleById,
  idBeingDeleted,
  setIdBeingDeleted,
}: {
  allModules: Module[]
  deleteModuleById: (id: { moduleId: string }) => void
  idBeingDeleted: string | null
  setIdBeingDeleted: (id: string | null) => void
}) {
  return (
    <Table className="mt-6">
      {/* Table Header - header values for columns */}
      <TableHead>
        <TableRow>
          <TableHeaderCell>Module ID</TableHeaderCell>
          <TableHeaderCell>Module Name</TableHeaderCell>
          <TableHeaderCell>Module Description</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHead>

      {/* Table Body - contains all dynamic data */}
      <TableBody>
        {allModules.map((module) => (
          <TableRow key={module.moduleId} className="[&>*]:text-foreground">
            <TableCell>{module.moduleId}</TableCell>
            <TableCell>{module.moduleName}</TableCell>
            <TableCell>{module.moduleDesc}</TableCell>

            {/* Buttons to update or delete data */}
            <TableCell className="flex gap-2">
              {/* Dropdown Menu - contains actions for each student */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size={'icon'} variant={'ghost'} className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="#" className="flex">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View info
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert('Not implemented yet')}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      deleteModuleById({
                        moduleId: module.moduleId,
                      })
                      setIdBeingDeleted(module.moduleId)
                    }}
                  >
                    {idBeingDeleted === module.moduleId && (
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        size={14}
                      />
                    )}
                    {idBeingDeleted !== module.moduleId && (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
