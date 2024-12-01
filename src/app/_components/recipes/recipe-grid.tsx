// src/components/recipes/recipe-grid.tsx
"use client";

import { type Recipe, MealType } from "@prisma/client";
import { type RecipeFiltersType } from "./recipe-filters";
import { RecipeCard } from "./recipe-card";
import { Skeleton } from "~/components/ui/skeleton";

interface RecipeGridProps {
  recipes?: (Recipe & {
    isFavourite: boolean;
    ingredients: {
      ingredient: {
        name: string;
      };
      quantity: number;
      unit: string;
    }[];
    instructions: {
      step: string;
      orderIndex: number;
    }[];
  })[];
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
      recipe.mealType.some((mealType) => filters.mealTypes.includes(mealType)),
    )
    .filter((recipe) => !filters.showFavourites || recipe.isFavourite);

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

  if (isLoading) {
    return <RecipeGridSkeleton />;
  }

  return (
    <div className="space-y-8 p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
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
