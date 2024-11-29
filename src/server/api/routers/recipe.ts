// src/server/api/routers/recipes.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { MealType } from "@prisma/client";

// First, define our input schema for creating recipes
const createRecipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().optional(),
  servings: z.number().int().positive().default(1),
  prepTime: z.number().int().positive().optional(),
  cookTime: z.number().int().positive().optional(),
  sourceUrl: z.string().url().optional(),
  mealType: z.nativeEnum(MealType),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string(),
        quantity: z.number().positive(),
        unit: z.string().min(1),
        notes: z.string().optional(),
      }),
    )
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(
      z.object({
        step: z.string().min(1),
        orderIndex: z.number().int(),
      }),
    )
    .min(1, "At least one instruction step is required"),
});

export const recipesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.db.recipe.findMany({
      where: {
        createdBy: ctx.user.id,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return recipes.map((recipe) => ({
      ...recipe,
      isFavourite: recipe.favourites.length > 0,
      favourites: undefined, // Remove the favourites array from the response
    }));
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
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found",
        });
      }

      // Check if user has access to this recipe
      if (recipe.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to view this recipe",
        });
      }

      return {
        ...recipe,
        isFavourite: recipe.favourites.length > 0,
        favourites: undefined,
      };
    }),

  create: protectedProcedure
    .input(createRecipeSchema)
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
        name: z.string().min(1, "Recipe name is required"),
        description: z.string().optional(),
        servings: z.number().int().positive().default(1),
        prepTime: z.number().int().positive().optional(),
        cookTime: z.number().int().positive().optional(),
        sourceUrl: z.string().url().optional().or(z.literal("")),
        mealType: z.nativeEnum(MealType),
        ingredients: z.array(
          z.object({
            id: z.string().optional(), // existing ingredient relation id
            ingredientId: z.string(),
            quantity: z.number().positive(),
            unit: z.string().min(1),
            notes: z.string().optional(),
          }),
        ),
        instructions: z.array(
          z.object({
            id: z.string().optional(), // existing instruction id
            step: z.string().min(1),
            orderIndex: z.number().int(),
          }),
        ),
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
});

// Export types for use in components
export type RecipeWithDetails = Awaited<
  ReturnType<typeof recipesRouter.getAll>
>[number];
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
