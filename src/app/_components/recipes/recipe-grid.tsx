// src/components/recipes/recipe-grid.tsx
"use client";

import { type Recipe, MealType } from "@prisma/client";
import { type RecipeFiltersType } from "./recipe-filters";
import { RecipeCard } from "./recipe-card";
import { Skeleton } from "~/components/ui/skeleton";

interface RecipeGridProps {
  recipes?: Recipe[];
  filters: RecipeFiltersType;
  isLoading: boolean;
}

export function RecipeGrid({
  recipes = [],
  filters,
  isLoading,
}: RecipeGridProps) {
  const filteredRecipes = recipes
    .filter((recipe) => filters.mealTypes.includes(recipe.mealType as MealType))
    .filter((recipe) => !filters.showFavourites || recipe.favourites);

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (filters.sortBy === "name") {
      return filters.sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (filters.sortBy === "totalTime") {
      const aTotal = (a.prepTime ?? 0) + (a.cookTime ?? 0);
      const bTotal = (b.prepTime ?? 0) + (b.cookTime ?? 0);
      return filters.sortOrder === "asc" ? aTotal - bTotal : bTotal - aTotal;
    }
    if (filters.sortBy === "servings") {
      return filters.sortOrder === "asc"
        ? a.servings - b.servings
        : b.servings - a.servings;
    }
    return 0;
  });

  const recipesByMealType = Object.values(MealType).reduce(
    (acc, mealType) => {
      if (filters.mealTypes.includes(mealType)) {
        acc[mealType] = sortedRecipes.filter(
          (recipe) => recipe.mealType === mealType,
        );
      }
      return acc;
    },
    {} as Record<MealType, Recipe[]>,
  );

  if (isLoading) {
    return <RecipeGridSkeleton />;
  }

  return (
    <div className="space-y-8">
      {Object.entries(recipesByMealType).map(([mealType, recipes]) => (
        <section key={mealType}>
          <h2 className="mb-4 text-2xl font-semibold">
            {mealType.charAt(0) + mealType.slice(1).toLowerCase()}
          </h2>
          {recipes.length === 0 ? (
            <p className="text-muted-foreground">No recipes found</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      ))}
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
