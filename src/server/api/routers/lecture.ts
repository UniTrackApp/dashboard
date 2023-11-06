import { createTRPCRouter, protectedProcedure } from "../trpc";

export const lectureRouter = createTRPCRouter({
  // Note to team: I'm naming this variable whateverProps so I can show you how destructuring works later
  getLectureCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.lecture.count();
  }),
});
