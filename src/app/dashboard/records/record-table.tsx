import { type $Enums } from "@prisma/client";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Check, CheckCheck, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { AttendanceStatus } from "~/utils/constants";

type AttendanceRecord = {
  attendanceRecordId: string;
  studentId: string;
  lectureId: string;
  status: $Enums.Status;
  timestamp: Date;
  studentFullName: string;
  moduleName: string;
};

export default function RecordTable({
  attendanceData,
  idBeingDeleted,
  setIdBeingDeleted,
  deleteRecordById,
}: {
  attendanceData: AttendanceRecord[] | undefined;
  idBeingDeleted: string | null;
  setIdBeingDeleted: (id: string | null) => void;
  deleteRecordById: (id: { attendanceRecordId: string }) => void;
}) {
  return (
    <Table className="mt-4">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Attendance Record ID</TableHeaderCell>
          <TableHeaderCell>Student ID</TableHeaderCell>
          <TableHeaderCell>Student Name</TableHeaderCell>
          <TableHeaderCell>Lecture ID</TableHeaderCell>
          <TableHeaderCell>Module Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Timestamp</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attendanceData?.map((record) => (
          <TableRow key={record.attendanceRecordId}>
            <TableCell>{record.attendanceRecordId}</TableCell>
            <TableCell>{record.studentId}</TableCell>
            <TableCell>{record.studentFullName}</TableCell>
            <TableCell>{record.lectureId}</TableCell>
            <TableCell>
              <Badge color="neutral" size="xs">
                {record.moduleName}
              </Badge>
            </TableCell>
            <TableCell>
              {record.status === AttendanceStatus.PRESENT && (
                <Badge color="green" size="sm" icon={CheckCheck}>
                  {record.status.toUpperCase()}
                </Badge>
              )}
              {record.status === AttendanceStatus.LATE && (
                <Badge color="amber" size="sm" icon={Check}>
                  {record.status.toUpperCase()}
                </Badge>
              )}
              {record.status === AttendanceStatus.ABSENT && (
                <Badge color="red" size="sm" icon={X}>
                  {record.status.toUpperCase()}
                </Badge>
              )}
            </TableCell>
            <TableCell>{record.timestamp.toUTCString()}</TableCell>
            <TableCell className="flex gap-2">
              <Button
                size={"icon"}
                variant={"default"}
                className="h-6 w-6 bg-neutral-500"
                onClick={() => alert("Not implemented yet")}
              >
                <Pencil size={14} />
              </Button>
              <Button
                size={"icon"}
                variant={"destructive"}
                className="h-6 w-6"
                disabled={idBeingDeleted === record.attendanceRecordId}
                onClick={() => {
                  deleteRecordById({
                    attendanceRecordId: record.attendanceRecordId,
                  });
                  setIdBeingDeleted(record.attendanceRecordId);
                }}
              >
                {idBeingDeleted === record.attendanceRecordId && (
                  <Loader2 className="animate-spin" size={14} />
                )}
                {idBeingDeleted !== record.attendanceRecordId && (
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
