import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const enrollmentRouter = createTRPCRouter({
  createEnrollment: protectedProcedure
    .input(
      z.object({
        studentId: z
          .string()
          .min(1, "Required field")
          .max(10, "Must be 10 characters or less")
          .regex(/^[0-9]+$/, "Must be a number"),
        moduleId: z
          .string()
          .min(1, "Required field")
          .max(10, "Must be 15 characters or less")
          .startsWith("COMP", `Module ID must start with "COMP"`),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.enrollment.create({
        data: {
          studentId: input.studentId,
          moduleId: input.moduleId,
        },
      });
    }),

  getAllEnrollments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.enrollment.findMany();
  }),

  getEnrollmentCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.enrollment.count();
  }),

  deleteEnrollmentById: protectedProcedure
    .input(
      z.object({
        enrollmentId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.enrollment.delete({
        where: {
          enrollmentId: input.enrollmentId,
        },
      });
    }),
});
