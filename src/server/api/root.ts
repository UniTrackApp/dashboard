import { postRouter } from "~/server/api/routers/post";
import { studentRouter } from "~/server/api/routers/student";
import { createTRPCRouter } from "~/server/api/trpc";
import { attendanceRecordRouter } from "./routers/attendance-records";
import { enrollmentRouter } from "./routers/enrollment";
import { lectureRouter } from "./routers/lecture";
import { moduleRouter } from "./routers/module";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  student: studentRouter,
  lecture: lectureRouter,
  module: moduleRouter,
  attendanceRecord: attendanceRecordRouter,
  enrollment: enrollmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
