import { createTRPCRouter, protectedProcedure } from "../trpc";

export const lectureRouter = createTRPCRouter({
  getLectureCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.lecture.count();
  }),

  getAllLectureIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.lecture.findMany({
      select: {
        lectureId: true,
      },
    });
  }),
});
