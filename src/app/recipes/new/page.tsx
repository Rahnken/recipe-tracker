// src/app/recipes/new/page.tsx
"use client";

import { RecipeForm } from "~/app/_components/recipes/recipe-form";
import { type RecipeFormData } from "~/lib/schemas/recipe";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();
  const utils = api.useUtils();

  const createRecipe = api.recipes.create.useMutation({
    onSuccess: async (recipe) => {
      // Redirect to the new recipe's page
      await utils.recipes.invalidate();
      router.push(`/recipes/${recipe.id}`);
    },
  });

  const handleSubmit = async (data: RecipeFormData) => {
    await createRecipe.mutateAsync(data);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Recipe</h1>
        <p className="text-muted-foreground">
          Add a new recipe to your collection
        </p>
      </div>
      <RecipeForm
        onSubmit={handleSubmit}
        isSubmitting={createRecipe.isPending}
      />
    </div>
  );
}
