import { Role } from '@prisma/client'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  // NOTE: Disabling authentication for now
  getUserRole: protectedProcedure.query(() => {
    // const user = await ctx.prisma.user.findUnique({
    //   where: {
    //     id: ctx.session.user.id,
    //   },
    //   select: {
    //     role: true,
    //   },
    // })

    // return user?.role
    return 'ADMIN'
  }),
})
