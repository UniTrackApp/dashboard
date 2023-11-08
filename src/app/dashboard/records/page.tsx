"use client";

import {
  Badge,
  BadgeDelta,
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
import { Plus } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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

  const { data: attendanceDataRaw } =
    api.attendanceRecord.getAttendanceRecords.useQuery();
  const { data: attendanceData } =
    api.attendanceRecord.getAttendanceRecordsForTable.useQuery();
  const { data: attendanceCount } =
    api.attendanceRecord.getAttendanceRecordCount.useQuery();
  const { mutate: createNewRecordEntry, status } =
    api.attendanceRecord.addAttendanceRecord.useMutation();

  return (
    <div className="flex flex-col justify-center">
      <p className="text-xl font-medium">Add an attendance record</p>
      <div className="flex flex-col gap-4">
        <div>
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
        <div>
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
        <div>
          <Label htmlFor="status">Status</Label>
          <SelectorToggle formData={formData} setFormData={setFormData} />
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
          >
            <Plus size={20} className="mr-2" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Display attendance records
      <div>
        <p>Attendance Records</p>
        <div className="flex flex-wrap gap-4">
          {data?.map((record) => {
            return (
              <div
                key={record.attendanceRecordId}
                className="w-fit rounded-md bg-neutral-200 p-4"
              >
                <p>{record.studentId}</p>
                <p>{record.lectureId}</p>
                <p>{record.status}</p>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Table to display attendance records */}
      <div>
        <Card>
          <Flex justifyContent="between">
            <Flex justifyContent="start" className="gap-2">
              <Title>Attendance Records</Title>
              <Badge color="blue">{attendanceCount}</Badge>
            </Flex>
            <Button size={"sm"}>
              <Plus size={20} className="mr-2" />
              Add New Record
            </Button>
          </Flex>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Attendance Record ID</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Student ID
                </TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Student Name
                </TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Lecture ID
                </TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Module Name
                </TableHeaderCell>
                <TableHeaderCell className="text-right">Status</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Timestamp
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData?.map((item) => (
                <TableRow key={item.attendanceRecordId}>
                  <TableCell>{item.attendanceRecordId}</TableCell>
                  <TableCell className="text-right">{item.studentId}</TableCell>
                  <TableCell className="text-right">
                    {item.studentName}
                  </TableCell>
                  <TableCell className="text-right">{item.lectureId}</TableCell>
                  <TableCell className="text-right">
                    {item.moduleName}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status === "PRESENT" && (
                      <Badge color="green" size="xs">
                        {item.status}
                      </Badge>
                    )}
                    {item.status === "ABSENT" && (
                      <Badge color="red" size="xs">
                        {item.status}
                      </Badge>
                    )}
                    {item.status === "LATE" && (
                      <Badge color="amber" size="xs">
                        {item.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.timestamp.toUTCString()}
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
