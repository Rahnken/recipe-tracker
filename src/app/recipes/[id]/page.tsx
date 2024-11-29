// src/app/recipes/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Clock, Users, Heart, ArrowLeft, ExternalLink } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { RecipeEditDialog } from "~/app/_components/recipes/recipe-edit-dialog";
import { RecipeShareDialog } from "~/app/_components/recipes/recipe-share-dialog";

export default function RecipePage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: recipe, isLoading } = api.recipes.getById.useQuery({
    id: id as string,
  });

  const utils = api.useUtils();
  const toggleFavourite = api.recipes.toggleFavourite.useMutation({
    onSuccess: () => {
      void utils.recipes.getById.invalidate({ id: id as string });
    },
  });

  if (isLoading) {
    return <RecipePageSkeleton />;
  }

  if (!recipe) {
    return null;
  }

  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <RecipeEditDialog recipe={recipe} />
          <RecipeShareDialog recipeId={recipe.id} />
        </div>
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">{recipe.name}</h1>
            {recipe.description && (
              <p className="mt-2 text-lg text-muted-foreground">
                {recipe.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavourite.mutate({ recipeId: recipe.id })}
            disabled={toggleFavourite.isPending}
          >
            <Heart
              className={cn(
                "h-6 w-6",
                recipe.isFavourite
                  ? "fill-current text-red-500"
                  : "text-muted-foreground",
              )}
            />
          </Button>
        </div>

        {/* Recipe Meta */}
        <div className="flex flex-wrap gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}
          </div>
          {totalTime > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {totalTime} minutes
              {recipe.prepTime && recipe.cookTime && (
                <span className="text-sm">
                  (Prep: {recipe.prepTime}m, Cook: {recipe.cookTime}m)
                </span>
              )}
            </div>
          )}
          {recipe.sourceUrl && (
            <Link
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <ExternalLink className="h-5 w-5" />
              Source Recipe
            </Link>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((item) => (
              <li key={item.id} className="flex items-baseline">
                <span className="mr-2 font-medium">
                  {item.quantity} {item.unit}
                </span>
                <span>{item.ingredient.name}</span>
                {item.notes && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({item.notes})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction) => (
              <li key={instruction.id} className="flex gap-4">
                <span className="font-mono font-bold text-muted-foreground">
                  {instruction.orderIndex + 1}.
                </span>
                <span>{instruction.step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function RecipePageSkeleton() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-8">
        <div>
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="mt-2 h-6 w-1/2" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div>
          <Skeleton className="mb-4 h-8 w-40" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="mb-4 h-8 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
