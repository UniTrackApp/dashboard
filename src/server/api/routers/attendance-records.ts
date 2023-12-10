import { Status } from '@prisma/client'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const attendanceRecordRouter = createTRPCRouter({
  // CREATE: Creates a new attendance record entry in the database
  createAttendanceRecord: protectedProcedure
    .input(
      z.object({
        studentId: z
          .string()
          .min(1, 'Required field')
          .max(10, 'Must be 10 characters or less')
          .regex(/^[0-9]+$/, 'Must be a number'),
        lectureId: z
          .string()
          .min(1, 'Required field')
          .max(20, 'Must be 20 characters or less')
          .startsWith('COMP', `Lecture ID must start with "COMP"`),
        status: z.union([
          z.literal(Status.PRESENT),
          z.literal(Status.LATE),
          z.literal(Status.ABSENT),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.attendanceRecord.create({
        data: {
          studentId: input.studentId,
          lectureId: input.lectureId,
          status: input.status,
        },
      })
    }),

  // GET: Gets only the number of attendance record entries
  getAttendanceRecordCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.attendanceRecord.count()
  }),

  // GET: Gets all rows and columns from the attendance record table
  getAttendanceRecords: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.attendanceRecord.findMany()
  }),

  // GET: Gets a single attendance record entry by its ID (primary key)
  getAttendanceRecordById: protectedProcedure
    .input(
      z.object({
        attendanceRecordId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.attendanceRecord.findUnique({
        where: {
          attendanceRecordId: input.attendanceRecordId,
        },
      })
    }),

  // GET: Gets all rows and columns from the attendance record table, but with the student's full name and module name
  getAttendanceRecordsForTable: protectedProcedure.query(async ({ ctx }) => {
    const attendanceRecords = await ctx.prisma.attendanceRecord.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return attendanceRecords.map((attendanceRecord) => ({
      attendanceRecordId: attendanceRecord.attendanceRecordId,
      studentId: attendanceRecord.studentId,
      lectureId: attendanceRecord.lectureId,
      status: attendanceRecord.status,
      timestamp: attendanceRecord.timestamp,
      studentFullName: `${attendanceRecord.Student.firstName} ${attendanceRecord.Student.lastName}`,
      moduleName: attendanceRecord.Lecture.Module.moduleName,
    }))
  }),

  // UPDATE: Updates an attendance record's status value by its ID (primary key)
  updateAttendanceRecord: protectedProcedure
    .input(
      z.object({
        attendanceRecordId: z.string().cuid().optional(),
        status: z
          .union([
            z.literal(Status.PRESENT),
            z.literal(Status.LATE),
            z.literal(Status.ABSENT),
          ])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.attendanceRecord.update({
        where: {
          attendanceRecordId: input.attendanceRecordId,
        },
        data: {
          status: input.status,
        },
      })
    }),

  // DELETE: Deletes an attendance record entry by its ID (primary key)
  deleteAttendanceRecordById: protectedProcedure
    .input(
      z.object({
        attendanceRecordId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.attendanceRecord.delete({
        where: {
          attendanceRecordId: input.attendanceRecordId,
        },
      })
    }),

  // DELETE: Deletes multiple attendance record entries using a provided array of IDs (primary key)
  deleteAttendanceRecordsByIds: protectedProcedure
    .input(
      z.object({
        attendanceRecordIds: z.array(z.string().cuid()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.attendanceRecord.deleteMany({
        where: {
          attendanceRecordId: {
            in: input.attendanceRecordIds,
          },
        },
      })
    }),
})
