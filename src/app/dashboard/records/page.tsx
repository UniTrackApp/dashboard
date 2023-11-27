"use client";

import { Badge, Card, Flex, Title } from "@tremor/react";
import { Plus } from "lucide-react";
import { useState } from "react";

import AddAttendanceRecordForm from "~/app/dashboard/records/add-record-form";
import RecordTable from "~/app/dashboard/records/record-table";
import { buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/use-toast";

import { api } from "~/utils/api";

export default function Records() {
  // State - used for button loading spinners during attendance record creation and deletion
  const [idBeingDeleted, setIdBeingDeleted] = useState<string | null>(null);
  const [isBeingAdded, setIsBeingAdded] = useState(false);

  // State - used to close dialog after an attendance record is added
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  // Fetches all attendance records, and refetches when createNewRecord is called
  const {
    data: allAttendanceRecords,
    refetch: refetchAllAttendanceRecords,
    isLoading: isLoadingAllAttendanceRecords,
  } = api.attendanceRecord.getAttendanceRecordsForTable.useQuery();

  // Fetches attendance record count, and refetches when createNewRecord is called
  const {
    data: attendanceRecordCount,
    refetch: refetchAttendanceRecordCount,
    isLoading: isLoadingAttendanceRecordCount,
  } = api.attendanceRecord.getAttendanceRecordCount.useQuery();

  // Creates a new attendance record entry
  const { mutate: createAttendanceRecord } =
    api.attendanceRecord.createAttendanceRecord.useMutation({
      // Displays a toast notification when the mutation is successful
      onSuccess() {
        toast({
          title: "Attendance Record Added ✅",
          description: `Attendance record added to database successfully.`,
        });
        void refetchAllAttendanceRecords();
        void refetchAttendanceRecordCount();
        setIsBeingAdded(false);
        setDialogIsOpen(false);
      },
      // Displays a toast notification when the mutation fails
      // TODO: Fetch error message from server and display it in the toast description
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

  // Deletes an attendance record entry
  const { mutate: deleteAttendanceRecordById } =
    api.attendanceRecord.deleteAttendanceRecordById.useMutation({
      // Displays a toast notification when the mutation is successful
      onSuccess() {
        toast({
          title: "Attendance Record Deleted ✅",
          description: "Attendance record deleted from database successfully.",
        });
        void refetchAllAttendanceRecords();
        void refetchAttendanceRecordCount();
        setIdBeingDeleted(null);
      },
      // Displays a toast notification when the mutation fails
      // TODO: Fetch error message from server and display it in the toast description
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

  return (
    <div className="flex flex-col justify-center">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Attendance Records
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage attendance records for your students here. Including adding new
          records, and deleting existing ones.
        </p>
        <Separator className="my-6" />
      </div>

      {/* Card - Contains table and button to add new students */}
      <div>
        <Card>
          {/* Card Title - displays table name + item counts */}
          <Flex justifyContent="between">
            <Flex justifyContent="start" className="gap-2">
              <Title>Attendance Records</Title>
              {isLoadingAttendanceRecordCount && (
                <Skeleton className="h-[25px] w-[35px] rounded-full" />
              )}
              {attendanceRecordCount && (
                <Badge color="blue">{attendanceRecordCount}</Badge>
              )}
            </Flex>

            {/* Dialog - used to create new Attendance Records */}
            <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
              <DialogTrigger className={buttonVariants({ className: "w-fit" })}>
                <Plus size={20} className="mr-2" />
                Add Record
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add an attendance record</DialogTitle>
                  <DialogDescription>
                    <div className="mt-4 flex flex-col gap-4">
                      <AddAttendanceRecordForm
                        createNewRecordEntry={createAttendanceRecord}
                        isBeingAdded={isBeingAdded}
                        setIsBeingAdded={setIsBeingAdded}
                      />
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </Flex>

          {/* Table - to display Attendance Records */}
          {isLoadingAllAttendanceRecords && (
            <div className="mt-4 flex flex-col gap-4">
              <Skeleton className="h-[35px] w-full" />
              <Skeleton className="h-[500px] w-full" />
            </div>
          )}
          {allAttendanceRecords && (
            <RecordTable
              allAttendanceRecords={allAttendanceRecords}
              deleteAttendanceRecordById={deleteAttendanceRecordById}
              idBeingDeleted={idBeingDeleted}
              setIdBeingDeleted={setIdBeingDeleted}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
