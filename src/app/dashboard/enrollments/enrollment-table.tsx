import { type Enrollment } from '@prisma/client'
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
import { buttonVariants } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

export default function EnrollmentTable({
  allEnrollments,
  deleteEnrollmentById,
  idBeingDeleted,
  setIdBeingDeleted,
}: {
  allEnrollments: Enrollment[]
  deleteEnrollmentById: (id: { enrollmentId: string }) => void
  idBeingDeleted: string | null
  setIdBeingDeleted: (id: string | null) => void
}) {
  return (
    <Table className="mt-4">
      {/* Table Header - header values for columns */}
      <TableHead>
        <TableRow>
          <TableHeaderCell>Enrollment ID</TableHeaderCell>
          <TableHeaderCell>Student ID</TableHeaderCell>
          <TableHeaderCell>Module ID</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHead>

      {/* Table Body - contains all dynamic data */}
      <TableBody>
        {allEnrollments?.map((enrollment) => (
          <TableRow
            key={enrollment.enrollmentId}
            className="[&>*]:text-foreground"
          >
            <TableCell>{enrollment.enrollmentId}</TableCell>
            <TableCell>{enrollment.studentId}</TableCell>
            <TableCell>{enrollment.moduleId}</TableCell>

            {/* Buttons to update or delete data */}
            <TableCell className="flex gap-2">
              {/* Dropdown Menu - contains actions for each student */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({
                    size: 'icon',
                    variant: 'ghost',
                    className: 'h-8 w-8',
                  })}
                >
                  <MoreHorizontal className="h-5 w-5" />
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
                      deleteEnrollmentById({
                        enrollmentId: enrollment.enrollmentId,
                      })
                      setIdBeingDeleted(enrollment.enrollmentId)
                    }}
                  >
                    {idBeingDeleted === enrollment.enrollmentId && (
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        size={14}
                      />
                    )}
                    {idBeingDeleted !== enrollment.enrollmentId && (
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
