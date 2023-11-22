import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const enrollmentRouter = createTRPCRouter({
  createEnrollment: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        moduleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.enrollment.create({
        data: {
          studentId: input.studentId,
          moduleId: input.moduleId,
        },
      });
    }),

  getAllEnrollments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.enrollment.findMany();
  }),

  getEnrollmentCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.enrollment.count();
  }),

  deleteEnrollmentById: protectedProcedure
    .input(
      z.object({
        enrollmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.enrollment.delete({
        where: {
          enrollmentId: input.enrollmentId,
        },
      });
    }),
});
