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

export default function RecipesPage() {
  const [filters, setFilters] = useState<RecipeFiltersType>({
    mealTypes: Object.values(MealType),
    sortBy: "name",
    sortOrder: "asc",
    showFavourites: false,
  });

  const { data: recipes, isLoading } = api.recipes.getAll.useQuery();

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Recipe
          </Link>
        </Button>
      </div>

      <RecipeFilters filters={filters} onFilterChange={setFilters} />

      <RecipeGrid recipes={recipes} filters={filters} isLoading={isLoading} />
    </div>
  );
}
