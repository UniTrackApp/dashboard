import { Status } from '@prisma/client'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const attendanceRecordRouter = createTRPCRouter({
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

  getAttendanceRecordCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.attendanceRecord.count()
  }),

  getAttendanceRecords: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.attendanceRecord.findMany()
  }),

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
})
