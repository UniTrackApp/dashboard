import { createTRPCRouter, protectedProcedure } from "../trpc";

export const uniTrackRouter = createTRPCRouter({
  getAllTableCounts: protectedProcedure.query(async ({ ctx }) => {
    const studentCount = await ctx.prisma.student.count();
    const lectureCount = await ctx.prisma.lecture.count();
    const moduleCount = await ctx.prisma.module.count();
    const attendanceRecordCount = await ctx.prisma.attendanceRecord.count();

    return {
      studentCount,
      lectureCount,
      moduleCount,
      attendanceRecordCount,
    };
  }),
});
