import { Student } from "@prisma/client";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Button } from "~/components/ui/button";

import {
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

export default function StudentTable({
  allStudentsInfo,
  deleteStudentById,
  isBeingDeleted,
  setIsBeingDeleted,
}: {
  allStudentsInfo: Student[];
  deleteStudentById: (id: { studentId: string }) => void;
  isBeingDeleted: string | null;
  setIsBeingDeleted: (value: string) => void;
}) {
  return (
    <>
      <Table className="mt-5">
        <TableHead>
          <TableRow className="[&>*]:text-muted-foreground">
            <TableHeaderCell>Student ID</TableHeaderCell>
            <TableHeaderCell>Student Card ID</TableHeaderCell>
            <TableHeaderCell>First Name</TableHeaderCell>
            <TableHeaderCell>Last Name</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHead>

        {/* Table Body - renders dynamic data from our tRPC endpoint we fetched in beginning */}
        <TableBody>
          {allStudentsInfo?.map((student) => (
            <TableRow key={student.studentId} className="[&>*]:text-foreground">
              <TableCell>{student.studentId}</TableCell>
              <TableCell>{student.studentCardId}</TableCell>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{student.lastName}</TableCell>
              <TableCell className="flex gap-2">
                {/* Dropdown Menu - contains actions for each student */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button size={"icon"} variant={"ghost"} className="h-8 w-8">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href={`/dashboard/students/${student.studentId}`}
                        className="flex"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View info
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert("Not implemented yet")}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        deleteStudentById({
                          studentId: student.studentId,
                        });
                        setIsBeingDeleted(student.studentId);
                      }}
                    >
                      {isBeingDeleted === student.studentId && (
                        <Loader2
                          className="mr-2 h-4 w-4 animate-spin"
                          size={14}
                        />
                      )}
                      {isBeingDeleted !== student.studentId && (
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
    </>
  );
}
