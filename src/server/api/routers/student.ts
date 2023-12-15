import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

// This is a tRPC router used to manage API calls to the Student table
export const studentRouter = createTRPCRouter({
  // CREATE: Creates a new student entry in the database
  createStudent: protectedProcedure
    // Takes in an input object that is validated using zod
    .input(
      z.object({
        firstName: z
          .string()
          .min(1, 'Required field')
          .max(50, 'Must be 50 characters or less'),
        lastName: z
          .string()
          .min(1, 'Required field')
          .max(50, 'Must be 50 characters or less'),
        studentId: z
          .string()
          .min(1, 'Required field')
          .max(10, 'Must be 10 characters or less')
          .regex(/^[0-9]+$/, 'Must be a number'),
        studentCardId: z
          .string()
          .toUpperCase()
          .min(1, 'Required field')
          .max(50, 'Must be 50 characters or less'),
      }),
    )
    // This mutation function takes in the input object and creates a new entry in the database
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.student.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          studentId: input.studentId,
          studentCardId: input.studentCardId,
        },
      })
    }),

  // GET: Gets all rows and columns from the student table
  getAllStudents: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.student.findMany()
  }),

  // GET: Gets a specific student entry by their ID (primary key)
  getStudentById: protectedProcedure
    .input(
      z
        .string()
        .min(1, 'Required field')
        .max(10, 'Must be 10 characters or less')
        .regex(/^[0-9]+$/, 'Must be a number'),
    )
    .query(async (props) => {
      return props.ctx.prisma.student.findFirst({
        where: {
          studentId: props.input,
        },
      })
    }),

  // GET: Gets a specific student entry by their card ID
  getStudentByCardId: protectedProcedure
    .input(
      z
        .string()
        .min(1, 'Required field')
        .max(10, 'Must be 10 characters or less')
        .regex(/^[0-9]+$/, 'Must be a number'),
    )
    .query(async (props) => {
      return props.ctx.prisma.student.findFirst({
        where: {
          studentCardId: props.input,
        },
      })
    }),

  // GET: Gets the number of student entries
  getStudentCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.student.count()
  }),

  // GET: Gets all student IDs from the student table
  getAllStudentIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.student.findMany({
      select: {
        studentId: true,
      },
    })
  }),

  // UPDATE: Updates a student entry by its ID (primary key)
  updateStudent: protectedProcedure
    .input(
      z.object({
        currentStudentId: z
          .string()
          .max(10, 'Must be 10 characters or less')
          .regex(/^[0-9]+$/, 'Must be a number'),
        updatedStudentId: z
          .string()
          .max(10, 'Must be 10 characters or less')
          .regex(/^[0-9]+$/, 'Must be a number')
          .optional(),
        studentCardId: z
          .string()
          .toUpperCase()
          .max(50, 'Must be 50 characters or less')
          .optional(),
        firstName: z
          .string()
          .max(50, 'Must be 50 characters or less')
          .optional(),
        lastName: z
          .string()
          .min(1, 'Required field')
          .max(50, 'Must be 50 characters or less')
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.student.update({
        where: {
          studentId: input.currentStudentId,
        },
        data: {
          studentId: input.updatedStudentId ?? undefined,
          studentCardId: input.studentCardId ?? undefined,
          firstName: input.firstName ?? undefined,
          lastName: input.lastName ?? undefined,
        },
      })
    }),

  // DELETE: Deletes a student entry by its ID (primary key)
  deleteStudentById: protectedProcedure
    // Takes in an input object that is validated using zod
    .input(
      z.object({
        studentId: z
          .string()
          .min(1, 'Required field')
          .max(10, 'Must be 10 characters or less')
          .regex(/^[0-9]+$/, 'Must be a number'),
      }),
    )
    // This mutation function takes in the input object and deletes the entry in the database
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.student.delete({
        where: {
          studentId: input.studentId,
        },
      })
    }),
})
