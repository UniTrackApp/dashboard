import { Lecture, type Module } from "@prisma/client";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

type LecturesWithModuleNames = Lecture & {
  Module: {
    moduleName: string;
  };
};

export default function ModuleTable({
  allLectures,
  deleteLectureById,
  idBeingDeleted,
  setIdBeingDeleted,
}: {
  allLectures: LecturesWithModuleNames[];
  deleteLectureById: (id: { lectureId: string }) => void;
  idBeingDeleted: string | null;
  setIdBeingDeleted: (id: string | null) => void;
}) {
  return (
    <Table className="mt-6">
      {/* Table Header - header values for columns */}
      <TableHead>
        <TableRow>
          <TableHeaderCell>Lecture ID</TableHeaderCell>
          <TableHeaderCell>Module ID</TableHeaderCell>
          <TableHeaderCell>Module Name</TableHeaderCell>
          <TableHeaderCell>Start Time</TableHeaderCell>
          <TableHeaderCell>End Time</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHead>

      {/* Table Body - contains all dynamic data */}
      <TableBody>
        {allLectures.map((lecture) => (
          <TableRow key={lecture.lectureId}>
            <TableCell>{lecture.lectureId}</TableCell>
            <TableCell>{lecture.moduleId}</TableCell>
            <TableCell>
              <Badge color="neutral" size="xs">
                {lecture.Module.moduleName}
              </Badge>
            </TableCell>
            <TableCell>{lecture.startTime.toUTCString()}</TableCell>
            <TableCell>{lecture.endTime.toUTCString()}</TableCell>

            {/* Buttons to update or delete data */}
            <TableCell className="flex gap-2">
              <Button
                size={"icon"}
                variant={"default"}
                className="h-6 w-6 bg-neutral-500 dark:bg-neutral-600 dark:text-white"
                onClick={() => alert("Not implemented yet")}
              >
                <Pencil size={14} />
              </Button>
              <Button
                size={"icon"}
                variant={"destructive"}
                className="h-6 w-6"
                disabled={idBeingDeleted === lecture.lectureId}
                onClick={() => {
                  deleteLectureById({
                    lectureId: lecture.lectureId,
                  });
                  setIdBeingDeleted(lecture.lectureId);
                }}
              >
                {idBeingDeleted === lecture.lectureId && (
                  <Loader2 className="animate-spin" size={14} />
                )}
                {idBeingDeleted !== lecture.lectureId && <Trash2 size={14} />}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
