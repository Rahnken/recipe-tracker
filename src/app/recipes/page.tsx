// src/app/recipes/page.tsx
"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { MealType } from "@prisma/client";
import { Plus } from "lucide-react";
import { RecipeGrid } from "~/app/_components/recipes/recipe-grid";
import { RecipeFilters } from "~/app/_components/recipes/recipe-filters";
import type { RecipeFiltersType } from "~/app/_components/recipes/recipe-filters";
import { api } from "~/trpc/react";
import Link from "next/link";
import { RecipeSettings } from "../_components/recipes/recipe-settings";

export default function RecipesPage() {
  const [filters, setFilters] = useState<RecipeFiltersType>({
    mealTypes: Object.values(MealType),
    sortBy: "name",
    sortOrder: "asc",
    showFavourites: false,
    hideDefaults: false,
  });

  const { data: recipes, isLoading } = api.recipes.getAll.useQuery();

  return (
    <div className="w-full">
      {/* Header and filters - always full width */}
      <div className="mx-4 mb-6 flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <div className="mr-4 flex flex-col gap-2">
          <Button asChild>
            <Link href="/recipes/new">
              <Plus className="mr-2 h-4 w-4" />
              New Recipe
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <RecipeSettings />
            <RecipeFilters filters={filters} onFilterChange={setFilters} />
          </div>
        </div>
      </div>

      {/* Grid with consistent width */}
      <div className="w-full">
        <RecipeGrid recipes={recipes} filters={filters} isLoading={isLoading} />
      </div>
    </div>
  );
}
