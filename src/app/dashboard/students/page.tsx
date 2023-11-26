"use client";

import {
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Pencil,
  RefreshCcw,
  Trash2,
  UserPlus2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from "@tremor/react";
import Link from "next/link";
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
import { Separator } from "~/components/ui/separator";

type StudentInfo = {
  firstName: string;
  lastName: string;
  studentId: string;
  studentCardId: string;
};

export default function Students() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<StudentInfo>({
    firstName: "",
    lastName: "",
    studentId: "",
    studentCardId: "",
  });

  const [isBeingDeleted, setIsBeingDeleted] = useState<string | null>(null);

  const { data: allStudentsInfo, refetch: refetchAllStudents } =
    api.student.getAllStudents.useQuery();

  const { data: studentCount, refetch: refetchStudentCount } =
    api.student.getStudentCount.useQuery();

  const { mutate: createStudent, status: createStudentStatus } =
    api.student.createStudent.useMutation({
      onSuccess({ firstName, studentId }) {
        toast({
          title: "Student Added ✅",
          description: `${firstName} (${studentId}) has been added to the database.`,
        });
        void refetchAllStudents();
        void refetchStudentCount();
      },
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

  const { mutate: deleteStudentById } =
    api.student.deleteStudentById.useMutation({
      onSuccess({ firstName }) {
        toast({
          title: "Student Deleted ❌",
          description: `${firstName} has been deleted from the database.`,
        });
        void refetchAllStudents();
        void refetchStudentCount();
        setIsBeingDeleted(null);
      },
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Students</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your student data here. Only students enrolled in a module will
          be able to have attendance records.
        </p>
        <Separator className="my-6" />
      </div>

      {/* Card - Contains table and button to add new students */}
      <Card>
        {/* Card Title - displays table name + item counts */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Title>Students</Title>
            <Badge color="blue">{studentCount}</Badge>
          </div>

          {/* Button - to add new students */}
          <Dialog>
            <DialogTrigger
              className={buttonVariants({
                variant: "default",
                className: "w-fit",
              })}
            >
              <UserPlus2 className="mr-2" />
              Add Student
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register a student</DialogTitle>
                <DialogDescription>
                  {/* Form - Student Registration */}
                  <div className="mt-4 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="w-full"
                        value={formData?.firstName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData?.lastName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            lastName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        type="text"
                        placeholder="c1234567"
                        value={formData?.studentId}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            studentId: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="studentCardId">Student Card ID</Label>
                      <div className="flex justify-between gap-4">
                        <Input
                          id="studentCardId"
                          type="text"
                          placeholder="ABC123"
                          className="w-full"
                          value={formData?.studentCardId}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              studentCardId: e.target.value,
                            });
                          }}
                        />
                        <Button size={"icon"} className="shrink-0">
                          <RefreshCcw />
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="mx-auto w-fit"
                      onClick={() => {
                        createStudent(formData);
                      }}
                      disabled={createStudentStatus === "loading"}
                      variant={"default"}
                      size={"lg"}
                    >
                      {createStudentStatus === "loading" && (
                        <Loader2 className="mr-2 animate-spin" size={24} />
                      )}
                      <UserPlus2 className="mr-2" />
                      Add Student
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table - to view all students data */}
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
              <TableRow
                key={student.studentId}
                className="[&>*]:text-foreground"
              >
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.studentCardId}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell className="flex gap-2">
                  {/* Dropdown Menu - contains actions for each student */}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="h-8 w-8"
                      >
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
                            firstName: student.firstName,
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
      </Card>
    </>
  );
}
