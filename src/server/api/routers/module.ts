import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

// This is a tRPC router used to manage API calls to the Module table
export const moduleRouter = createTRPCRouter({
  // CREATE: Creates a new module entry in the database
  createModule: protectedProcedure
    // Takes in an input object that is validated using zod
    .input(
      z.object({
        moduleId: z
          .string()
          .min(1, 'Required field')
          .max(10, 'Must be 15 characters or less')
          .startsWith('COMP', `Module ID must start with "COMP"`),
        moduleName: z.string().min(1),
        moduleDesc: z
          .string()
          .max(60, 'Description must be less than 60 characters')
          .nullish(), // nullish means it can be null or undefined
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
      })
    }),

  // GET: Gets only the number of module entries
  getModuleCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.module.count()
  }),

  // GET: Gets all rows and columns from the module table
  getAllModules: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.module.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),

  // UPDATE: Updates a module entry
  updateModule: protectedProcedure
    .input(
      z.object({
        currentModuleId: z
          .string()
          .max(10, 'Must be 15 characters or less')
          .startsWith('COMP', `Module ID must start with "COMP"`),
        updatedModuleId: z
          .string()
          .max(10, 'Must be 15 characters or less')
          .startsWith('COMP', `Module ID must start with "COMP"`)
          .optional(),
        moduleName: z.string().optional(),
        moduleDesc: z
          .string()
          .max(60, 'Description must be less than 60 characters')
          .optional()
          .nullish(), // nullish means it can be null or undefined
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.module.update({
        where: {
          moduleId: input.currentModuleId,
        },
        data: {
          moduleId: input.updatedModuleId,
          moduleName: input.moduleName,
          moduleDesc: input.moduleDesc,
        },
      })
    }),

  // DELETE: Deletes a module entry by its ID (primary key)
  deleteModuleById: protectedProcedure
    // Takes in an input object that is validated using zod
    .input(
      z.object({
        moduleId: z
          .string()
          .min(1, 'Required field')
          .max(10, 'Must be 15 characters or less')
          .startsWith('COMP', `Module ID must start with "COMP"`),
      }),
    )
    // This mutation function takes in the input object and deletes the entry in the database
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.module.delete({
        where: {
          moduleId: input.moduleId,
        },
      })
    }),

  deleteModulesByIds: protectedProcedure
    .input(
      z.object({
        moduleIds: z.array(
          z
            .string()
            .min(1, 'Required field')
            .max(10, 'Must be 15 characters or less')
            .startsWith('COMP', `Module ID must start with "COMP"`),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.module.deleteMany({
        where: {
          moduleId: {
            in: input.moduleIds,
          },
        },
      })
    }),
})
