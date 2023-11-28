import type { Lecture } from '@prisma/client'
import {
  Badge,
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

type LecturesWithModuleNames = Lecture & {
  Module: {
    moduleName: string
  }
}

export default function ModuleTable({
  allLectures,
  deleteLectureById,
  idBeingDeleted,
  setIdBeingDeleted,
}: {
  allLectures: LecturesWithModuleNames[]
  deleteLectureById: (id: { lectureId: string }) => void
  idBeingDeleted: string | null
  setIdBeingDeleted: (id: string | null) => void
}) {
  return (
    <Table className="mt-6">
      {/* Table Header - header values for columns */}
      <TableHead>
        <TableRow>
          <TableHeaderCell>Lecture ID</TableHeaderCell>
          <TableHeaderCell>Module ID</TableHeaderCell>
          <TableHeaderCell>Module Name</TableHeaderCell>
          <TableHeaderCell>Start Time</TableHeaderCell>
          <TableHeaderCell>End Time</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHead>

      {/* Table Body - contains all dynamic data */}
      <TableBody>
        {allLectures.map((lecture) => (
          <TableRow key={lecture.lectureId} className="[&>*]:text-foreground">
            <TableCell>{lecture.lectureId}</TableCell>
            <TableCell>{lecture.moduleId}</TableCell>
            <TableCell>
              <Badge color="neutral" size="xs">
                {lecture.Module.moduleName}
              </Badge>
            </TableCell>
            <TableCell>{lecture.startTime.toUTCString()}</TableCell>
            <TableCell>{lecture.endTime.toUTCString()}</TableCell>

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
                      deleteLectureById({
                        lectureId: lecture.lectureId,
                      })
                      setIdBeingDeleted(lecture.lectureId)
                    }}
                  >
                    {idBeingDeleted === lecture.lectureId && (
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        size={14}
                      />
                    )}
                    {idBeingDeleted !== lecture.lectureId && (
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
