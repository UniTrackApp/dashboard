import { z } from "zod";
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
      },
    });

    const studentNames = await ctx.db.student.findMany({
      select: {
        studentId: true,
        firstName: true,
        lastName: true,
      },
      where: {
        studentId: {
          in: attendanceRecords.map(
            (attendanceRecord) => attendanceRecord.studentId,
          ),
        },
      },
    });

    const lectureNames = await ctx.db.lecture.findMany({
      select: {
        moduleId: true,
      },
    });

    const moduleNames = await ctx.db.module.findMany({
      select: {
        moduleId: true,
        moduleName: true,
      },
      where: {
        moduleId: {
          in: lectureNames.map((lecture) => lecture.moduleId),
        },
      },
    });

    return attendanceRecords.map((attendanceRecord) => {
      const studentName = studentNames.find(
        (student) => student.studentId === attendanceRecord.studentId,
      );

      // TODO: This logic is bad, we're looping over twice - but I'm not sure how to fix this
      const moduleName = moduleNames.find((module) =>
        lectureNames.find((lecture) => lecture.moduleId === module.moduleId),
      );

      console.log(moduleName);

      return {
        attendanceRecordId: attendanceRecord.attendanceRecordId,
        studentId: attendanceRecord.studentId,
        studentName: `${studentName?.firstName} ${studentName?.lastName}`,
        lectureId: attendanceRecord.lectureId,
        moduleName: moduleName?.moduleName,
        status: attendanceRecord.status,
        timestamp: attendanceRecord.timestamp,
      };
    });
  }),

  addAttendanceRecord: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        lectureId: z.string(),
        status: z.union([
          z.literal("PRESENT"),
          z.literal("ABSENT"),
          z.literal("LATE"),
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
