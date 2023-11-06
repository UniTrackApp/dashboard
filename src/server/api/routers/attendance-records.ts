import { createTRPCRouter, protectedProcedure } from "../trpc";

export const attendanceRecordRouter = createTRPCRouter({
  // Note to team: I'm naming this variable whateverProps so I can show you how destructuring works later
  getAttendanceRecordCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.attendanceRecord.count();
  }),
});
