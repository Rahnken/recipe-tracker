// src/server/api/routers/recipes.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const recipesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.db.recipe.findMany({
      where: {
        OR: [
          { createdBy: ctx.user.id },
          // You could add shared recipe logic here
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get user's favourites
    const favourites = await ctx.db.userFavouriteRecipe.findMany({
      where: {
        userId: ctx.user.id,
        recipeId: {
          in: recipes.map((recipe) => recipe.id),
        },
      },
    });

    const favouriteIds = new Set(favourites.map((fav) => fav.recipeId));

    return recipes.map((recipe) => ({
      ...recipe,
      isfavourite: favouriteIds.has(recipe.id),
    }));
  }),

  togglefavourite: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const favourite = await ctx.db.userFavouriteRecipe.findUnique({
        where: {
          userId_recipeId: {
            userId: ctx.user.id,
            recipeId: input.recipeId,
          },
        },
      });

      if (favourite) {
        // Remove favourite
        await ctx.db.userFavouriteRecipe.delete({
          where: {
            id: favourite.id,
          },
        });
      } else {
        // Add favourite
        await ctx.db.userFavouriteRecipe.create({
          data: {
            userId: ctx.user.id,
            recipeId: input.recipeId,
          },
        });
      }

      return { success: true };
    }),
});
