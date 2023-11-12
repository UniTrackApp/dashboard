import { z } from "zod";
import { AttendanceStatus } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const attendanceRecordRouter = createTRPCRouter({
  getAttendanceRecordCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.attendanceRecord.count();
  }),

  getAttendanceRecords: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.attendanceRecord.findMany();
  }),

  getAttendanceRecordsForTable: protectedProcedure.query(async ({ ctx }) => {
    const attendanceRecords = await ctx.db.attendanceRecord.findMany({
      select: {
        attendanceRecordId: true,
        studentId: true,
        lectureId: true,
        status: true,
        timestamp: true,
        Student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        Lecture: {
          select: {
            Module: {
              select: {
                moduleName: true,
              },
            },
          },
        },
      },
    });

    return attendanceRecords.map((attendanceRecord) => ({
      attendanceRecordId: attendanceRecord.attendanceRecordId,
      studentId: attendanceRecord.studentId,
      lectureId: attendanceRecord.lectureId,
      status: attendanceRecord.status,
      timestamp: attendanceRecord.timestamp,
      studentFullName: `${attendanceRecord.Student.firstName} ${attendanceRecord.Student.lastName}`,
      moduleName: attendanceRecord.Lecture.Module.moduleName,
    }));
  }),

  deleteAttendanceRecordById: protectedProcedure
    .input(
      z.object({
        attendanceRecordId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.attendanceRecord.delete({
        where: {
          attendanceRecordId: input.attendanceRecordId,
        },
      });
    }),

  addAttendanceRecord: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        lectureId: z.string(),
        status: z.union([
          z.literal(AttendanceStatus.PRESENT),
          z.literal(AttendanceStatus.LATE),
          z.literal(AttendanceStatus.ABSENT),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.attendanceRecord.create({
        data: {
          studentId: input.studentId,
          lectureId: input.lectureId,
          status: input.status,
        },
      });
    }),
});
