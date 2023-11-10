"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

import {
  Badge,
  Card,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import {
  Check,
  CheckCheck,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/ui/use-toast";

import { api } from "~/utils/api";

type FormType = {
  studentId: string;
  lectureId: string;
  status: "PRESENT" | "LATE" | "ABSENT";
};

export default function Records() {
  const [formData, setFormData] = useState<FormType>({
    studentId: "",
    lectureId: "",
    status: "PRESENT",
  });

  const { data: attendanceData, refetch: refetchAttendanceData } =
    api.attendanceRecord.getAttendanceRecordsForTable.useQuery();
  const { data: attendanceCount, refetch: refetchAttendanceCount } =
    api.attendanceRecord.getAttendanceRecordCount.useQuery();
  const { mutate: createNewRecordEntry } =
    api.attendanceRecord.addAttendanceRecord.useMutation({
      onSuccess() {
        toast({
          title: "Attendance Record Added ✅",
          description: `Attendance record added to database successfully.`,
        });
        void refetchAttendanceData();
        void refetchAttendanceCount();
      },
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

  const { mutate: deleteRecordById, status: deleteRecordStatus } =
    api.attendanceRecord.deleteAttendanceRecordById.useMutation({
      onSuccess() {
        toast({
          title: "Attendance Record Deleted ✅",
          description: "Attendance record deleted from database successfully.",
        });
        void refetchAttendanceData();
        void refetchAttendanceCount();
        setIsBeingDeleted(null);
      },
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

  const [isBeingDeleted, setIsBeingDeleted] = useState<string | null>(null);

  return (
    <div className="flex flex-col justify-center">
      {/* Card - Contains table and button to add new students */}
      <div>
        <Card>
          {/* Card Title - displays table name + item counts */}
          <Flex justifyContent="between">
            <Flex justifyContent="start" className="gap-2">
              <Title>Attendance Records</Title>
              <Badge color="blue">{attendanceCount}</Badge>
            </Flex>

            {/* Dialog - used to create new Attendance Records */}
            <Dialog>
              <DialogTrigger className={buttonVariants({ className: "w-fit" })}>
                <Plus size={20} className="mr-2" />
                Add New Record
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add an attendance record</DialogTitle>
                  <DialogDescription>
                    <div className="mt-4 flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          placeholder="Enter the student ID"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              studentId: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="lectureId">Lecture ID</Label>
                        <Input
                          placeholder="Enter the lecture ID"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              lectureId: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="status">Status</Label>
                        <SelectorToggle
                          formData={formData}
                          setFormData={setFormData}
                        />
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            createNewRecordEntry({
                              studentId: formData.studentId,
                              lectureId: formData.lectureId,
                              status: formData.status,
                            });
                          }}
                          className="mt-4"
                        >
                          <Plus size={20} className="mr-2" />
                          Add Record
                        </Button>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </Flex>

          {/* Table - to display Attendance Records */}
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
              {attendanceData?.map((item) => (
                <TableRow key={item.attendanceRecordId}>
                  <TableCell>{item.attendanceRecordId}</TableCell>
                  <TableCell>{item.studentId}</TableCell>
                  <TableCell>{item.studentFullName}</TableCell>
                  <TableCell>{item.lectureId}</TableCell>
                  <TableCell>
                    <Badge color="neutral" size="xs">
                      {item.moduleName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status === "PRESENT" && (
                      <Badge color="green" size="sm" icon={CheckCheck}>
                        {item.status.toLowerCase()}
                      </Badge>
                    )}
                    {item.status === "LATE" && (
                      <Badge color="amber" size="sm" icon={Check}>
                        {item.status.toLowerCase()}
                      </Badge>
                    )}
                    {item.status === "ABSENT" && (
                      <Badge color="red" size="sm" icon={X}>
                        {item.status.toLowerCase()}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{item.timestamp.toUTCString()}</TableCell>
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
                      disabled={isBeingDeleted === item.attendanceRecordId}
                      onClick={() => {
                        deleteRecordById({
                          attendanceRecordId: item.attendanceRecordId,
                        });
                        setIsBeingDeleted(item.attendanceRecordId);
                        void refetchAttendanceData();
                      }}
                    >
                      {isBeingDeleted === item.attendanceRecordId && (
                        <Loader2 className="animate-spin" size={14} />
                      )}
                      {isBeingDeleted !== item.attendanceRecordId && (
                        <Trash2 size={14} />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

// Used for attendace status selector
function SelectorToggle({
  formData,
  setFormData,
}: {
  formData: FormType;
  setFormData: Dispatch<SetStateAction<FormType>>;
}) {
  return (
    <Select
      onValueChange={(value) => {
        if (value === "present") {
          setFormData({
            ...formData,
            status: "PRESENT",
          });
        } else if (value === "late") {
          setFormData({
            ...formData,
            status: "LATE",
          });
        } else if (value === "absent") {
          setFormData({
            ...formData,
            status: "ABSENT",
          });
        }
      }}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Attendance Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="present">Present</SelectItem>
        <SelectItem value="late">Late</SelectItem>
        <SelectItem value="absent">Absent</SelectItem>
      </SelectContent>
    </Select>
  );
}
