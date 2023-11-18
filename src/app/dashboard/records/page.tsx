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
import { toast } from "~/components/ui/use-toast";

import { api } from "~/utils/api";

export default function Records() {
  const [idBeingDeleted, setIdBeingDeleted] = useState<string | null>(null);
  const [isBeingAdded, setIsBeingAdded] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const { data: allAttendanceRecords, refetch: refetchAllAttendanceRecords } =
    api.attendanceRecord.getAttendanceRecordsForTable.useQuery();
  const { data: attendanceCount, refetch: refetchAttendanceCount } =
    api.attendanceRecord.getAttendanceRecordCount.useQuery();

  const { mutate: deleteRecordById } =
    api.attendanceRecord.deleteAttendanceRecordById.useMutation({
      onSuccess() {
        toast({
          title: "Attendance Record Deleted ✅",
          description: "Attendance record deleted from database successfully.",
        });
        void refetchAllAttendanceRecords();
        void refetchAttendanceCount();
        setIdBeingDeleted(null);
      },
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

  const { mutate: createNewRecordEntry } =
    api.attendanceRecord.addAttendanceRecord.useMutation({
      onSuccess() {
        toast({
          title: "Attendance Record Added ✅",
          description: `Attendance record added to database successfully.`,
        });
        void refetchAllAttendanceRecords();
        void refetchAttendanceCount();
        setIsBeingAdded(false);
        setDialogIsOpen(false);
      },
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

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
            <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
              <DialogTrigger className={buttonVariants({ className: "w-fit" })}>
                <Plus size={20} className="mr-2" />
                Add New Record
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add an attendance record</DialogTitle>
                  <DialogDescription>
                    <div className="mt-4 flex flex-col gap-4">
                      <AddAttendanceRecordForm
                        createNewRecordEntry={createNewRecordEntry}
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
          <RecordTable
            attendanceData={allAttendanceRecords}
            deleteRecordById={deleteRecordById}
            idBeingDeleted={idBeingDeleted}
            setIdBeingDeleted={setIdBeingDeleted}
          />
        </Card>
      </div>
    </div>
  );
}
