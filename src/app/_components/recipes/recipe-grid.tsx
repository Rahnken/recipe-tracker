"use client";

import { MealType } from "@prisma/client";
import { Plus, Utensils } from "lucide-react";
import Link from "next/link";
import { type RecipeFiltersType } from "./recipe-filters";
import { RecipeCard } from "./recipe-card";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { type RecipeWithDetails } from "~/server/api/routers/recipe";

interface RecipeGridProps {
  recipes?: RecipeWithDetails[];
  filters: RecipeFiltersType;
  isLoading: boolean;
}

export function RecipeGrid({
  recipes = [],
  filters,
  isLoading,
}: RecipeGridProps) {
  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.mealType.some((mealType) => filters.mealTypes.includes(mealType)),
    )
    .filter((recipe) => !filters.showFavourites || recipe.isFavourite)
    .filter((recipe) => !filters.hideDefaults || !recipe.isDefault);

  if (isLoading) {
    return <RecipeGridSkeleton />;
  }

  return (
    // Add min-h-[500px] or another suitable minimum height
    <div className="min-h-[500px] space-y-8 p-4">
      {filteredRecipes.length === 0 ? (
        <div className="grid min-h-[300px] place-content-center gap-4 rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto grid w-full max-w-sm gap-2">
            <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold">No recipes found</h3>
            <p className="text-sm text-muted-foreground">
              {recipes.length > 0
                ? "Try adjusting your filters to find more recipes"
                : "Get started by adding your first recipe"}
            </p>

            {recipes.length === 0 && (
              <Button asChild className="mx-auto mt-4">
                <Link href="/recipes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recipe
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Add min-h-0 to prevent grid from expanding beyond content
        <div className="grid min-h-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecipeGridSkeleton() {
  return (
    <div className="space-y-8">
      {Object.values(MealType).map((mealType) => (
        <section key={mealType}>
          <Skeleton className="mb-4 h-8 w-32" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px]" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
