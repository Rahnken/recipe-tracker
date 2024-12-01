"use client";

import { MealType } from "@prisma/client";
import { ArrowDownAZ, ArrowUpAZ, X } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

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

  const clearMealTypes = () => {
    onFilterChange({ ...filters, mealTypes: [] });
  };

  return (
    <div className="my-6">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex flex-wrap items-start gap-4">
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

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={filters.sortOrder === "asc"}
                onCheckedChange={(checked) =>
                  onFilterChange({
                    ...filters,
                    sortOrder: checked ? "asc" : "desc",
                  })
                }
              />
              {filters.sortOrder === "asc" ? (
                <div className="flex items-center gap-1">
                  <ArrowUpAZ className="h-4 w-4" />
                  <Label>Ascending</Label>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <ArrowDownAZ className="h-4 w-4" />
                  <Label>Descending</Label>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={filters.showFavourites}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, showFavourites: checked })
                }
              />
              <Label>Show Favorites Only</Label>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto">
          <div className="flex items-center gap-2">
            <Label>Filter by Meal Types</Label>
            {filters.mealTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMealTypes}
                className="h-6 px-2 text-muted-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap">
            {Object.values(MealType).map((type) => (
              <Badge
                key={type}
                variant={
                  filters.mealTypes.includes(type) ? "default" : "outline"
                }
                className="cursor-pointer justify-center md:justify-start"
                onClick={() => toggleMealType(type)}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
                {filters.mealTypes.includes(type) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
