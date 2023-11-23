import { type Enrollment } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function EnrollmentTable({
  allEnrollments,
  deleteEnrollmentById,
  idBeingDeleted,
  setIdBeingDeleted,
}: {
  allEnrollments: Enrollment[];
  deleteEnrollmentById: (id: { enrollmentId: string }) => void;
  idBeingDeleted: string | null;
  setIdBeingDeleted: (id: string | null) => void;
}) {
  return (
    <Table className="mt-4">
      {/* Table Header - header values for columns */}
      <TableHead>
        <TableRow>
          <TableHeaderCell className="text-foreground dark:text-foreground">
            Enrollment ID
          </TableHeaderCell>
          <TableHeaderCell className="text-foreground dark:text-foreground">
            Student ID
          </TableHeaderCell>
          <TableHeaderCell className="text-foreground dark:text-foreground">
            Module ID
          </TableHeaderCell>
          <TableHeaderCell className="text-foreground dark:text-foreground">
            Actions
          </TableHeaderCell>
        </TableRow>
      </TableHead>

      {/* Table Body - contains all dynamic data */}
      <TableBody>
        {allEnrollments?.map((enrollment) => (
          <TableRow key={enrollment.enrollmentId}>
            <TableCell className="text-muted-foreground dark:text-muted-foreground">
              {enrollment.enrollmentId}
            </TableCell>
            <TableCell className="text-muted-foreground dark:text-muted-foreground">
              {enrollment.studentId}
            </TableCell>
            <TableCell className="text-muted-foreground dark:text-muted-foreground">
              {enrollment.moduleId}
            </TableCell>

            {/* Buttons to update or delete data */}
            <TableCell className="flex gap-2">
              <Button
                size={"icon"}
                variant={"default"}
                className="h-6 w-6 bg-neutral-500 dark:bg-neutral-600 dark:text-white"
                onClick={() => alert("Not implemented yet")}
              >
                <Pencil size={14} />
              </Button>
              <Button
                size={"icon"}
                variant={"destructive"}
                className="h-6 w-6"
                disabled={idBeingDeleted === enrollment.enrollmentId}
                onClick={() => {
                  deleteEnrollmentById({
                    enrollmentId: enrollment.enrollmentId,
                  });
                  setIdBeingDeleted(enrollment.enrollmentId);
                }}
              >
                {idBeingDeleted === enrollment.enrollmentId && (
                  <Loader2 className="animate-spin" size={14} />
                )}
                {idBeingDeleted !== enrollment.enrollmentId && (
                  <Trash2 size={14} />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
