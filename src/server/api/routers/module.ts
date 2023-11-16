import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// This is a tRPC router. A router is a collection of various tRPC endpoints or 'procedures' as they call it.
// We could technically have all our tRPC endpoints/procedures in a single router, but we use multiple routers purely for seperation of concerns.
// So one router to manage API calls to Module table while another router manages the API calls to Attendance Record table
// A procedure can be used to do 2 main things, either query some data or mutate some data somewhere
export const moduleRouter = createTRPCRouter({
  // This here is a procedure used to query the database and return some data
  // The frontend can 'call' this API endpoint/procedure to fetch this data from backend

  // 👇
  // Now we could have this EXACT SAME code in /pages/api like we do for the client
  // Benefit of using tRPC is that the frontend and backend can share datatypes using power of TypeScript
  // As we'll see soon, we'll need to do more work to parse request body etc for the 'create' endpoint we're creating in /pages/api for the client rn
  getModuleCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.module.count();
  }),

  getAllModules: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.module.findMany();
  }),

  createNewModule: protectedProcedure
    .input(
      z.object({
        moduleId: z.string().min(1),
        moduleName: z.string().min(1),
        moduleDesc: z.string().min(1).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.module.create({
        data: {
          moduleId: input.moduleId,
          moduleName: input.moduleName,
          moduleDesc: input.moduleDesc,
        },
      });
    }),
});
