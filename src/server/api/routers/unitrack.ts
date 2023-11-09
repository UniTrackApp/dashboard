import { createTRPCRouter, protectedProcedure } from "../trpc";

export const uniTrackRouter = createTRPCRouter({
  getAllTableCounts: protectedProcedure.query(async ({ ctx }) => {
    const studentCount = await ctx.db.student.count();
    const lectureCount = await ctx.db.lecture.count();
    const moduleCount = await ctx.db.module.count();
    const attendanceRecordCount = await ctx.db.attendanceRecord.count();

    return {
      studentCount,
      lectureCount,
      moduleCount,
      attendanceRecordCount,
    };
  }),
});
