import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// This is a tRPC router used to manage API calls to the Module table
export const moduleRouter = createTRPCRouter({
  // CREATE: Creates a new module entry in the database
  createModule: protectedProcedure
    // Takes in an input object that is validated using zod
    .input(
      z.object({
        moduleId: z
          .string()
          .min(1)
          .startsWith("COMP", `Module ID must start with "COMP"`),
        moduleName: z.string().min(1),
        moduleDesc: z.string().min(1).nullish(), // nullish means it can be null or undefined
      }),
    )
    // This mutation function takes in the input object and creates a new entry in the database
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.module.create({
        data: {
          moduleId: input.moduleId,
          moduleName: input.moduleName,
          moduleDesc: input.moduleDesc,
        },
      });
    }),

  // GET: Gets only the number of module entries
  getModuleCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.module.count();
  }),

  // GET: Gets all rows and columns from the module table
  getAllModules: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.module.findMany();
  }),

  // DELETE: Deletes a module entry by its ID (primary key)
  deleteModuleById: protectedProcedure
    // Takes in an input object that is validated using zod
    .input(
      z.object({
        moduleId: z.string().min(1),
      }),
    )
    // This mutation function takes in the input object and deletes the entry in the database
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.module.delete({
        where: {
          moduleId: input.moduleId,
        },
      });
    }),
});
