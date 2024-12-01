// src/components/recipes/recipe-edit-dialog.tsx
"use client";

import { useState } from "react";
import { type RecipeWithDetails } from "~/server/api/routers/recipe";
import { type RecipeFormData } from "~/lib/schemas/recipe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { RecipeForm } from "./recipe-form";
import { Pencil } from "lucide-react";
import { api } from "~/trpc/react";

interface RecipeEditDialogProps {
  recipe: RecipeWithDetails;
}

export function RecipeEditDialog({ recipe }: RecipeEditDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const updateRecipe = api.recipes.update.useMutation({
    onSuccess: () => {
      setOpen(false);
      void utils.recipes.getById.invalidate({ id: recipe.id });
    },
  });

  // Transform recipe data to form data format
  const formDefaultValues: Partial<RecipeFormData> = {
    name: recipe.name,
    description: recipe.description ?? "",
    servings: recipe.servings,
    prepTime: recipe.prepTime ?? undefined,
    cookTime: recipe.cookTime ?? undefined,
    sourceUrl: recipe.sourceUrl ?? undefined,
    mealType: recipe.mealType,
    ingredients: recipe.ingredients.map((ing) => ({
      id: ing.id,
      recipeId: ing.recipeId,
      ingredientId: ing.ingredientId,
      quantity: ing.quantity,
      unit: ing.unit,
      notes: ing.notes ?? undefined,
    })),
    instructions: recipe.instructions.map((inst) => ({
      id: inst.id,
      recipeId: inst.recipeId,
      step: inst.step,
      orderIndex: inst.orderIndex,
    })),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
        </DialogHeader>
        <RecipeForm
          defaultValues={formDefaultValues}
          onSubmit={async (data) => {
            await updateRecipe.mutateAsync({
              id: recipe.id,
              ...data,
            });
          }}
          isSubmitting={updateRecipe.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
