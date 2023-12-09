import { createTRPCRouter } from '~/server/api/trpc'

import { attendanceRecordRouter } from '~/server/api/routers/attendance-records'
import { enrollmentRouter } from '~/server/api/routers/enrollment'
import { lectureRouter } from '~/server/api/routers/lecture'
import { moduleRouter } from '~/server/api/routers/module'
import { postRouter } from '~/server/api/routers/post'
import { studentRouter } from '~/server/api/routers/student'
import { uniTrackRouter } from '~/server/api/routers/unitrack'
import { userRouter } from '~/server/api/routers/user'

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
  universal: uniTrackRouter,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
