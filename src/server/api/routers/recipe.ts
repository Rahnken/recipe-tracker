// src/server/api/routers/recipes.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { recipeFormSchema } from "~/lib/schemas/recipe";

export const recipesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.db.recipe.findMany({
      where: {
        OR: [
          { createdBy: ctx.user.id },
          {
            isDefault: true,
            hiddenBy: {
              none: {
                userId: ctx.user.id,
              },
            },
          },
        ],
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: {
          orderBy: {
            orderIndex: "asc",
          },
        },
        favourites: {
          where: {
            userId: ctx.user.id,
          },
          select: {
            id: true,
          },
        },
        hiddenBy: {
          where: {
            userId: ctx.user.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return recipes.map((recipe) => ({
      ...recipe,
      isFavourite: recipe.favourites.length > 0,
      isDefault: recipe.isDefault,
      favourites: undefined, // Remove the favourites array from the response
    }));
  }),

  toggleHidden: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findUnique({
        where: { id: input.recipeId },
        include: {
          hiddenBy: {
            where: {
              userId: ctx.user.id,
            },
          },
        },
      });

      if (!recipe?.isDefault) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (recipe.hiddenBy.length > 0) {
        await ctx.db.hiddenDefaultRecipe.deleteMany({
          where: {
            userId: ctx.user.id,
            recipeId: input.recipeId,
          },
        });
      } else {
        await ctx.db.hiddenDefaultRecipe.create({
          data: {
            userId: ctx.user.id,
            recipeId: input.recipeId,
          },
        });
      }

      return { success: true };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findUnique({
        where: { id: input.id },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
            orderBy: {
              id: "asc",
            },
          },
          instructions: {
            orderBy: {
              orderIndex: "asc",
            },
          },
          favourites: {
            where: {
              userId: ctx.user.id,
            },
            select: {
              id: true,
            },
          },
          hiddenBy: {
            where: {
              userId: ctx.user.id,
            },
          },
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found",
        });
      }

      // Check if user has access to this recipe
      if (recipe.createdBy !== ctx.user.id && !recipe.isDefault) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to view this recipe",
        });
      }

      // Transform to match getAll return type
      return {
        ...recipe,
        isFavourite: recipe.favourites.length > 0,
        favourites: undefined, // Remove the favourites array from the response
      };
    }),

  create: protectedProcedure
    .input(recipeFormSchema)
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.create({
        data: {
          name: input.name,
          description: input.description,
          servings: input.servings,
          prepTime: input.prepTime,
          cookTime: input.cookTime,
          sourceUrl: input.sourceUrl,
          mealType: input.mealType,
          createdBy: ctx.user.id,
          ingredients: {
            create: input.ingredients.map((ingredient) => ({
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              notes: ingredient.notes,
              ingredient: {
                connect: {
                  id: ingredient.ingredientId,
                },
              },
            })),
          },
          instructions: {
            create: input.instructions.map((instruction) => ({
              step: instruction.step,
              orderIndex: instruction.orderIndex,
            })),
          },
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          instructions: {
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
      });

      return recipe;
    }),

  toggleFavourite: protectedProcedure
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
        await ctx.db.userFavouriteRecipe.delete({
          where: {
            id: favourite.id,
          },
        });
      } else {
        await ctx.db.userFavouriteRecipe.create({
          data: {
            userId: ctx.user.id,
            recipeId: input.recipeId,
          },
        });
      }

      return { success: true };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        ...recipeFormSchema.shape, // Reuse the existing schema
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findUnique({
        where: { id: input.id },
        include: {
          ingredients: true,
          instructions: true,
        },
      });

      if (!recipe) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (recipe.createdBy !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Update the recipe with new data
      return ctx.db.$transaction(async (tx) => {
        // Delete removed ingredients and instructions
        await tx.recipeIngredient.deleteMany({
          where: {
            recipeId: input.id,
            id: {
              notIn: input.ingredients
                .map((i) => i.id)
                .filter((id): id is string => id !== undefined),
            },
          },
        });

        await tx.recipeInstruction.deleteMany({
          where: {
            recipeId: input.id,
            id: {
              notIn: input.instructions
                .map((i) => i.id)
                .filter((id): id is string => id !== undefined),
            },
          },
        });

        // Update recipe with new data
        return tx.recipe.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            servings: input.servings,
            prepTime: input.prepTime,
            cookTime: input.cookTime,
            sourceUrl: input.sourceUrl,
            mealType: input.mealType,
            ingredients: {
              upsert: input.ingredients.map((ingredient) => ({
                where: {
                  id: ingredient.id ?? "",
                },
                create: {
                  ingredientId: ingredient.ingredientId,
                  quantity: ingredient.quantity,
                  unit: ingredient.unit,
                  notes: ingredient.notes,
                },
                update: {
                  ingredientId: ingredient.ingredientId,
                  quantity: ingredient.quantity,
                  unit: ingredient.unit,
                  notes: ingredient.notes,
                },
              })),
            },
            instructions: {
              upsert: input.instructions.map((instruction) => ({
                where: {
                  id: instruction.id ?? "",
                },
                create: {
                  step: instruction.step,
                  orderIndex: instruction.orderIndex,
                },
                update: {
                  step: instruction.step,
                  orderIndex: instruction.orderIndex,
                },
              })),
            },
          },
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
            instructions: {
              orderBy: {
                orderIndex: "asc",
              },
            },
          },
        });
      });
    }),

  share: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        shareWith: z.array(z.string()), // Array of user IDs or emails
        permission: z.enum(["VIEW", "EDIT"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findUnique({
        where: { id: input.recipeId },
      });

      if (!recipe) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (recipe.createdBy !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.recipeShare.createMany({
        data: input.shareWith.map((userId) => ({
          recipeId: input.recipeId,
          userId,
          permission: input.permission,
        })),
      });
    }),
  unhideAllDefaults: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.hiddenDefaultRecipe.deleteMany({
      where: {
        userId: ctx.user.id,
      },
    });
    return { success: true };
  }),

  hideAllDefaults: protectedProcedure.mutation(async ({ ctx }) => {
    const defaultRecipes = await ctx.db.recipe.findMany({
      where: {
        isDefault: true,
      },
      select: {
        id: true,
      },
    });

    await ctx.db.hiddenDefaultRecipe.createMany({
      data: defaultRecipes.map((recipe) => ({
        userId: ctx.user.id,
        recipeId: recipe.id,
      })),
      skipDuplicates: true,
    });
    return { success: true };
  }),
});

// Export types for use in components
export type RecipeWithDetails = Awaited<
  ReturnType<typeof recipesRouter.getAll>
>[number];
