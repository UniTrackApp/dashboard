"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { api } from "~/utils/api";

import { Loader2, RefreshCcw, Trash2, UserPlus2 } from "lucide-react";
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
      <div className="mt-8 flex justify-center">
        {/* Registration Form */}
        <div className="flex flex-col gap-8 ">
          <p className="text-xl font-semibold">Register a student</p>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            className="-mt-6"
            value={formData?.firstName}
            onChange={(e) => {
              setFormData({
                ...formData,
                firstName: e.target.value,
              });
            }}
          />
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            className="-mt-6 lg:w-72"
            value={formData?.lastName}
            onChange={(e) => {
              setFormData({
                ...formData,
                lastName: e.target.value,
              });
            }}
          />
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            type="text"
            placeholder="c1234567"
            className="-mt-6 lg:w-72"
            value={formData?.studentId}
            onChange={(e) => {
              setFormData({
                ...formData,
                studentId: e.target.value,
              });
            }}
          />
          <Label htmlFor="studentCardId">Student Card ID</Label>
          <div className="-mt-6 flex justify-between gap-4">
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
      </div>

      {/* Student List - Cards */}
      <div className="mt-8 grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
        {getAllStudentInfo?.map((student) => {
          return (
            <div
              key={student.studentId}
              className="relative w-64 rounded-md border bg-white p-4"
            >
              <Button
                size={"icon"}
                variant={"destructive"}
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => {
                  deleteStudentById({
                    studentId: student.studentId,
                    firstName: student.firstName,
                  });
                  toast({
                    title: "Student Deleted 🎉",
                    description: `${student.firstName} has been deleted from the database.`,
                  });
                }}
              >
                <Trash2 size={18} />
              </Button>
              <p className="truncate">
                <span className="font-medium">First Name: </span>
                {student.firstName}
              </p>
              <p className="truncate">
                <span className="font-medium">Last Name: </span>
                {student.lastName}
              </p>
              <p>
                <span className="font-medium">Student ID: </span>
                {student.studentId}
              </p>
              <p>
                <span className="font-medium">Student ID Card: </span>
                {student.studentCardId}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
