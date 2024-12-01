// src/lib/schemas/recipe.ts
import { z } from "zod";
import { MealType } from "@prisma/client";

export const recipeIngredientSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  ingredientId: z.string(),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  notes: z.string().optional(),
});

export const recipeInstructionSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  step: z.string().min(1, "Instruction step is required"),
  orderIndex: z.number().int(),
});

export const recipeFormSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().optional(),
  servings: z
    .number()
    .int()
    .positive("Must have at least 1 serving")
    .default(1),
  prepTime: z.number().int().positive().optional(),
  cookTime: z.number().int().positive().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  mealType: z
    .array(z.nativeEnum(MealType))
    .min(1, "Select at least one meal type"),
  ingredients: z
    .array(recipeIngredientSchema)
    .min(1, "At least one ingredient is required")
    .default([]),
  instructions: z
    .array(recipeInstructionSchema)
    .min(1, "At least one instruction step is required"),
});

export type RecipeFormData = z.infer<typeof recipeFormSchema>;
