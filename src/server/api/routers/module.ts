import { createTRPCRouter, protectedProcedure } from "../trpc";

export const moduleRouter = createTRPCRouter({
  // Note to team: I'm naming this variable whateverProps so I can show you how destructuring works later
  getModuleCount: protectedProcedure.query(async ({ctx}) => {
    return await ctx.db.module.count();
  }),
});
