import { createTRPCRouter, protectedProcedure } from "../trpc";

export const attendanceRecordRouter = createTRPCRouter({
  // Note to team: I'm naming this variable whateverProps so I can show you how destructuring works later
  getAttendanceRecordCount: protectedProcedure.query(async (whateverProps) => {
    return await whateverProps.ctx.db.attendanceRecord.count();
  }),
});
