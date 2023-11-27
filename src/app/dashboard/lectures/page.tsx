"use client";

import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";

import { Badge, Card, Flex, Title } from "@tremor/react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";

import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import AddLectureForm from "./add-lecture-form";
import LectureTable from "./lecture-table";

export default function Lectures() {
  // State - used for button loading spinners during lecture creation and deletion
  const [idBeingDeleted, setIdBeingDeleted] = useState<string | null>(null);
  const [isBeingAdded, setIsBeingAdded] = useState(false);

  // State - used to close dialog after a lecture is added
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  // Fetches all lectures, and refetches when createNewLecture is called
  const {
    data: allLectures,
    refetch: refetchAllLectures,
    isLoading: isLoadingAllLectures,
  } = api.lecture.getAllLecturesWithModuleNames.useQuery();

  // Fetches lecture count and refetches when createNewLecture is called
  const {
    data: lectureCount,
    refetch: refetchLectureCount,
    isLoading: isLoadingLectureCount,
  } = api.lecture.getLectureCount.useQuery();

  // Creates a new lecture entry
  const { mutate: createNewLecture } = api.lecture.createNewLecture.useMutation(
    {
      // Displays a toast notification when the mutation is successful
      onSuccess() {
        toast({
          title: "Lecture Added ✅",
          description: `Lecture added to database successfully.`,
        });
        void refetchAllLectures();
        void refetchLectureCount();
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
    },
  );

  // Deletes a lecture by ID
  const { mutate: deleteLectureById } =
    api.lecture.deleteLectureRecordById.useMutation({
      // Displays a toast notification when the mutation is successful
      onSuccess() {
        toast({
          title: "Lecture Deleted ✅",
          description: "Lecture deleted from database successfully.",
        });
        void refetchAllLectures();
        void refetchLectureCount();
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
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lectures</h1>
        <p className="mt-1 text-muted-foreground">
          Manage all lectures here. Lectures will always belong to a module and
          will need to be enrolled to students.
        </p>
        <Separator className="my-6" />
      </div>

      {/* Card - Contains table and button to add new lectures */}
      <Card>
        {/* Card Title - displays table name + item counts */}
        <Flex justifyContent="between">
          <Flex justifyContent="start" className="gap-2">
            <Title>Lectures</Title>
            {isLoadingLectureCount && (
              <Skeleton className="h-[25px] w-[35px] rounded-full" />
            )}
            {lectureCount && <Badge color="blue">{lectureCount}</Badge>}
          </Flex>

          {/* Dialog - used to create new lectures */}
          <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger className={buttonVariants({ className: "w-fit" })}>
              <Plus size={20} className="mr-2" />
              Create Lecture
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new lecture</DialogTitle>
                <DialogDescription>
                  <div className="mt-4 flex flex-col gap-4">
                    <AddLectureForm
                      createNewLecture={createNewLecture}
                      isBeingAdded={isBeingAdded}
                      setIsBeingAdded={setIsBeingAdded}
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </Flex>

        {/* Table - to display all lectures */}
        {isLoadingAllLectures && (
          <div className="mt-4 flex flex-col gap-4">
            <Skeleton className="h-[35px] w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        )}
        {allLectures && (
          <LectureTable
            allLectures={allLectures}
            deleteLectureById={deleteLectureById}
            idBeingDeleted={idBeingDeleted}
            setIdBeingDeleted={setIdBeingDeleted}
          />
        )}
      </Card>
    </>
  );
}
