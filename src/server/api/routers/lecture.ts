import { z } from 'zod'
import {
  lectureIdSchema,
  lectureIdSchemaRequired,
  LectureSchemaCreate,
  moduleIdSchemaOptional,
  moduleIdSchemaRequired,
} from '~/types/schemas'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const lectureRouter = createTRPCRouter({
  // GET: Gets all lecture information
  getAllLectures: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany()
  }),

  // GET: Gets all lecture information with their respective module names
  getAllLecturesWithModuleNames: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany({
      include: {
        Module: {
          select: {
            moduleName: true,
          },
        },
      },
    })
  }),

  // GET: Gets all lecture's count
  getLectureCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.count()
  }),

  // GET: Gets all lecture IDs only
  getAllLectureIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany({
      select: {
        lectureId: true,
      },
    })
  }),

  // GET: Gets all lecture IDs with their respective module names
  getLectureIdsWithModuleNames: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany({
      select: {
        lectureId: true,
        Module: {
          select: {
            moduleName: true,
          },
        },
      },
    })
  }),

  // CREATE: Creates a new lecture record
  createLecture: protectedProcedure
    .input(LectureSchemaCreate)
    .mutation(async ({ ctx, input }) => {
      try {
        const newLectureRecord = await ctx.prisma.lecture.create({
          data: {
            lectureId: input.lectureId,
            startTime: input.startTime,
            endTime: input.endTime,
            moduleId: input.moduleId,
          },
        })

        return newLectureRecord
      } catch (error) {
        console.error('Error creating attendance record:', error)

        throw new Error('Failed to create attendance record')
      }
    }),

  // UPDATE: Updates a single lecture record by ID
  updateLecture: protectedProcedure
    .input(
      z.object({
        currentLectureId: lectureIdSchema.optional(), 
        updatedLectureId: lectureIdSchema.optional(),
        moduleId: moduleIdSchemaOptional.optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lecture.update({
        where: {
          lectureId: input.currentLectureId,
        },
        data: {
          lectureId: input.updatedLectureId,
          moduleId: input.moduleId,
          startTime: input.startTime,
          endTime: input.endTime,
        },
      })
    }),

  // DELETE: Deletes a single lecture record by ID
  deleteLectureById: protectedProcedure
    .input(
      z.object({
        lectureId: z
          .string()
          .min(1, 'Required field')
          .max(20, 'Must be 20 characters or less')
          .startsWith('COMP', `Lecture ID must start with "COMP"`),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.lecture.delete({
        where: {
          lectureId: input.lectureId,
        },
      })
    }),

  // DELETE: Deletes multiple lecture records by thier IDs
  deleteLecturesByIds: protectedProcedure
    .input(
      z.object({
        lectureIds: z.array(
          z
            .string()
            .min(1, 'Required field')
            .max(20, 'Must be 20 characters or less')
            .startsWith('COMP', `Lecture ID must start with "COMP"`),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.lecture.deleteMany({
        where: {
          lectureId: {
            in: input.lectureIds,
          },
        },
      })
    }),
})
