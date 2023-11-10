/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { api } from "~/utils/api";
import { cn } from "~/utils/shadcn";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  studentId: z.string(),
  lectureId: z.string(),
  attendanceStatus: z.union([
    z.literal("PRESENT"),
    z.literal("LATE"),
    z.literal("ABSENT"),
  ]),
});

export function AddAttendanceRecordForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    createNewRecordEntry({
      studentId: data.studentId,
      lectureId: data.lectureId,
      status: data.attendanceStatus,
    });
  }

  const { data: allStudentIds } = api.student.getAllStudentIds.useQuery();
  const { data: allLectureIds } = api.lecture.getAllLectureIds.useQuery();

  const { mutate: createNewRecordEntry } =
    api.attendanceRecord.addAttendanceRecord.useMutation({
      onSuccess() {
        toast({
          title: "Attendance Record Added ✅",
          description: `Attendance record added to database successfully.`,
        });
        // void refetchAttendanceData();
        // void refetchAttendanceCount();
      },
      onError() {
        toast({
          title: "Error 😢",
          description: "Something went wrong, please try again.",
        });
      },
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Combobox - Student ID */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Student ID</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[250px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? allStudentIds?.find(
                            (student) => student.studentId === field.value,
                          )?.studentId
                        : "Select student ID"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder="Search student IDs..." />
                    <CommandEmpty>No student ID found.</CommandEmpty>
                    <CommandGroup>
                      {allStudentIds?.map((student) => (
                        <CommandItem
                          value={student.studentId}
                          key={student.studentId}
                          onSelect={() => {
                            form.setValue("studentId", student.studentId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              student.studentId === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {student.studentId}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Open to view autocompletions...</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Combobox - Lecture ID */}
        <FormField
          control={form.control}
          name="lectureId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Lecture ID</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[250px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? allLectureIds?.find(
                            (lecture) => lecture.lectureId === field.value,
                          )?.lectureId
                        : "Select student ID"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder="Search lecture IDs..." />
                    <CommandEmpty>No lecture ID found.</CommandEmpty>
                    <CommandGroup>
                      {allLectureIds?.map((lecture) => (
                        <CommandItem
                          value={lecture.lectureId}
                          key={lecture.lectureId}
                          onSelect={() => {
                            form.setValue("lectureId", lecture.lectureId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              lecture.lectureId === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className="truncate">{lecture.lectureId}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Open to view autocompletions...</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select - status */}
        <FormField
          control={form.control}
          name="attendanceStatus"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-[250px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-[250px]">
                  <SelectItem value="PRESENT">PRESENT</SelectItem>
                  <SelectItem value="LATE">LATE</SelectItem>
                  <SelectItem value="ABSENT">ABSENT</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
