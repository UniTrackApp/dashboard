"use client";

import { Badge, Card, Flex, Title } from "@tremor/react";
import { Plus } from "lucide-react";
import { useState } from "react";

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

import AddEnrollmentForm from "./add-enrollment-form";
import EnrollmentTable from "./enrollment-table";

import { api } from "~/utils/api";

export default function Enrollments() {
  // State - used for button loading spinners during attendance record creation and deletion
  const [idBeingDeleted, setIdBeingDeleted] = useState<string | null>(null);
  const [isBeingAdded, setIsBeingAdded] = useState(false);

  // State - used to close dialog after an attendance record is added
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  // Fetches all enrollments, and refetches when createNewEnrollment is called
  const { data: allEnrollments, refetch: refetchAllEnrollments } =
    api.enrollment.getAllEnrollments.useQuery();

  // Fetches enrollment count, and refetches when createNewEnrollment is called
  const { data: enrollmentCount, refetch: refetchEnrollmentCount } =
    api.enrollment.getEnrollmentCount.useQuery();

  // Creates a new enrollment entry
  const { mutate: createEnrollment } =
    api.enrollment.createEnrollment.useMutation({
      // Displays a toast notification when the mutation is successful
      onSuccess() {
        toast({
          title: "Enrollment Added ✅",
          description: `Enrollment added to database successfully.`,
        });
        void refetchAllEnrollments();
        void refetchEnrollmentCount();
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

  // Deletes an enrollment entry
  const { mutate: deleteEnrollmentById } =
    api.enrollment.deleteEnrollmentById.useMutation({
      // Displays a toast notification when the mutation is successful
      onSuccess() {
        toast({
          title: "Enrollment Deleted ✅",
          description: "Enrollment deleted from database successfully.",
        });
        void refetchAllEnrollments();
        void refetchEnrollmentCount();
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
      {/* Card - Contains table and button to add new students */}
      <div>
        <Card>
          {/* Card Title - displays table name + item counts */}
          <Flex justifyContent="between">
            <Flex justifyContent="start" className="gap-2">
              <Title>Enrollments</Title>
              <Badge color="blue">{enrollmentCount}</Badge>
            </Flex>

            {/* Dialog - used to create new Attendance Records */}
            <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
              <DialogTrigger className={buttonVariants({ className: "w-fit" })}>
                <Plus size={20} className="mr-2" />
                Add Enrollment
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add an enrollment</DialogTitle>
                  <DialogDescription>
                    <div className="mt-4 flex flex-col gap-4">
                      <AddEnrollmentForm
                        createEnrollment={createEnrollment}
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
          {allEnrollments && (
            <EnrollmentTable
              allEnrollments={allEnrollments}
              deleteEnrollmentById={deleteEnrollmentById}
              idBeingDeleted={idBeingDeleted}
              setIdBeingDeleted={setIdBeingDeleted}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
