import { createTRPCRouter, protectedProcedure } from "../trpc";

export const moduleRouter = createTRPCRouter({
  getModuleCount: protectedProcedure.query(async ({ctx}) => {
    return await ctx.db.module.count();
  }),
});
