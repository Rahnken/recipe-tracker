// src/components/recipes/recipe-filters.tsx
"use client";

import { MealType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";

export type RecipeFiltersType = {
  mealTypes: MealType[];
  sortBy: "name" | "totalTime" | "servings";
  sortOrder: "asc" | "desc";
  showFavourites: boolean;
};

interface RecipeFiltersProps {
  filters: RecipeFiltersType;
  onFilterChange: (filters: RecipeFiltersType) => void;
}

export function RecipeFilters({ filters, onFilterChange }: RecipeFiltersProps) {
  const toggleMealType = (mealType: MealType) => {
    const newMealTypes = filters.mealTypes.includes(mealType)
      ? filters.mealTypes.filter((type) => type !== mealType)
      : [...filters.mealTypes, mealType];
    onFilterChange({ ...filters, mealTypes: newMealTypes });
  };

  return (
    <div className="my-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              sortBy: value as RecipeFiltersType["sortBy"],
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="totalTime">Total Time</SelectItem>
            <SelectItem value="servings">Servings</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortOrder}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              sortOrder: value as "asc" | "desc",
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch
            checked={filters.showFavourites}
            onCheckedChange={(checked) =>
              onFilterChange({ ...filters, showFavourites: checked })
            }
          />
          <Label>Show Favorites Only</Label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.values(MealType).map((type) => (
          <Badge
            key={type}
            variant={filters.mealTypes.includes(type) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleMealType(type)}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()}
            {filters.mealTypes.includes(type) && <X className="ml-1 h-3 w-3" />}
          </Badge>
        ))}
      </div>
    </div>
  );
}
