import { createTRPCRouter, protectedProcedure } from "../trpc";

export const attendanceRecordRouter = createTRPCRouter({
  getAttendanceRecordCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.attendanceRecord.count();
  }),
});
