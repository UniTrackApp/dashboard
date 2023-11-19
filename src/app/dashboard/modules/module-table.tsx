import { type Module } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function ModuleTable({
  allModules,
  deleteModuleById,
  idBeingDeleted,
  setIdBeingDeleted,
}: {
  allModules: Module[];
  deleteModuleById: (id: { moduleId: string }) => void;
  idBeingDeleted: string | null;
  setIdBeingDeleted: (id: string | null) => void;
}) {
  return (
    <Table className="mt-6">
      {/* Table Header - header values for columns */}
      <TableHead>
        <TableRow>
          <TableHeaderCell>Module ID</TableHeaderCell>
          <TableHeaderCell>Module Name</TableHeaderCell>
          <TableHeaderCell>Module Description</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHead>

      {/* Table Body - contains all dynamic data */}
      <TableBody>
        {allModules.map((module) => (
          <TableRow key={module.moduleId}>
            <TableCell>{module.moduleId}</TableCell>
            <TableCell>{module.moduleName}</TableCell>
            <TableCell>{module.moduleDesc}</TableCell>

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
                disabled={idBeingDeleted === module.moduleId}
                onClick={() => {
                  deleteModuleById({
                    moduleId: module.moduleId,
                  });
                  setIdBeingDeleted(module.moduleId);
                }}
              >
                {idBeingDeleted === module.moduleId && (
                  <Loader2 className="animate-spin" size={14} />
                )}
                {idBeingDeleted !== module.moduleId && <Trash2 size={14} />}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
