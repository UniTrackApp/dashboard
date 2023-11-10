"use client";

import { useState } from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { api } from "~/utils/api";

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
import { Loader2, RefreshCcw, Trash2, UserPlus2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useToast } from "~/components/ui/use-toast";

type StudentInfo = {
  firstName: string;
  lastName: string;
  studentId: string;
  studentCardId: string;
};

export default function Dashboard() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<StudentInfo>({
    firstName: "",
    lastName: "",
    studentId: "",
    studentCardId: "",
  });

  const { data: getAllStudentInfo, refetch: refetchLatestStudents } =
    api.student.getAllStudents.useQuery();

  const { data: studentCount } = api.student.getStudentCount.useQuery();

  const { mutate: createNewStudentEntry, status } =
    api.student.createStudent.useMutation({
      onSuccess({ firstName, studentId }) {
        toast({
          title: "Student Added ✅",
          description: `${firstName} (${studentId}) has been added to the database.`,
        });
        void refetchLatestStudents();
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
        void refetchLatestStudents();
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
      {/* Student List - Table */}
      <Card>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Title>Students</Title>
            <Badge color="blue">{studentCount}</Badge>
          </div>
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
                        createNewStudentEntry(formData);
                      }}
                      disabled={status === "loading"}
                      variant={"default"}
                      size={"lg"}
                    >
                      {status === "loading" && (
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
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Student ID</TableHeaderCell>
              <TableHeaderCell>Student Card ID</TableHeaderCell>
              <TableHeaderCell>First Name</TableHeaderCell>
              <TableHeaderCell>Last Name</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getAllStudentInfo?.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>
                  <Text>{student.studentCardId}</Text>
                </TableCell>
                <TableCell>
                  <Text>{student.firstName}</Text>
                </TableCell>
                <TableCell>
                  <Text>{student.lastName}</Text>
                </TableCell>
                <TableCell className="flex justify-center">
                  <Button
                    size={"icon"}
                    variant={"destructive"}
                    className="h-6 w-6"
                    onClick={() => {
                      deleteStudentById({
                        studentId: student.studentId,
                        firstName: student.firstName,
                      });
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
