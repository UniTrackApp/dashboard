import { createTRPCRouter, protectedProcedure } from "../trpc";

export const enrollmentRouter = createTRPCRouter({
  getEnrollmentCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.enrollment.count();
  }),
});
