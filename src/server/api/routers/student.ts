import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const studentRouter = createTRPCRouter({
  createStudent: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        studentId: z
          .string()
          .min(1)
          .max(8, "Student ID must be 8 characters max"),
        studentCardId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.student.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          studentId: input.studentId,
          studentCardId: input.studentCardId,
        },
      });
    }),

  getAllStudents: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.student.findMany();
  }),

  deleteStudentById: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        firstName: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.student.delete({
        where: {
          studentId: input.studentId,
        },
      });
    }),

  getStudentById: protectedProcedure
    .input(z.string().min(1).max(8))
    .query(async (props) => {
      return props.ctx.db.student.findFirst({
        where: {
          studentCardId: props.input,
        },
      });
    }),
});
