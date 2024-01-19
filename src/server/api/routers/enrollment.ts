import { TRPCError } from '@trpc/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

// Create a new ratelimit instance, used to rate limit the APIs to 1 request per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, '1 m'),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: '@upstash/ratelimit',
})

export const enrollmentRouter = createTRPCRouter({
  createEnrollment: protectedProcedure
    .input(
      z.object({
        studentId: z
          .string()
          .min(1, 'Required field')
          .max(10, 'Must be 10 characters or less')
          .regex(/^[0-9]+$/, 'Must be a number'),
        moduleId: z
          .string()
          .min(1, 'Required field')
          .max(10, 'Must be 15 characters or less')
          .startsWith('COMP', `Module ID must start with "COMP"`),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limits the API to 1 request per minute
      const { success } = await ratelimit.limit(ctx.session.user.id)
      if (!success) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'You are being rate limited. Try again later.',
        })
      }

      return await ctx.prisma.enrollment.create({
        data: {
          studentId: input.studentId,
          moduleId: input.moduleId,
        },
      })
    }),

  getAllEnrollments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.enrollment.findMany()
  }),

  getEnrollmentCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.enrollment.count()
  }),

  deleteEnrollmentById: protectedProcedure
    .input(
      z.object({
        enrollmentId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.enrollment.delete({
        where: {
          enrollmentId: input.enrollmentId,
        },
      })
    }),
})
