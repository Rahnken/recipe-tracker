// src/server/api/routers/ingredients.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const ingredientsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.ingredient.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ingredient.create({
        data: {
          name: input.name,
          category: input.category,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        category: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ingredient.update({
        where: { id: input.id },
        data: {
          name: input.name,
          category: input.category,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ingredient.delete({
        where: { id: input.id },
      });
    }),
});
