"use client";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

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
  hideDefaults: boolean;
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

  const selectAllMealTypes = () => {
    onFilterChange({ ...filters, mealTypes: Object.values(MealType) });
  };

  const allMealTypesSelected =
    filters.mealTypes.length === Object.values(MealType).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="default" className="flex gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {(filters.mealTypes.length > 0 || filters.showFavourites) && (
            <Badge variant="secondary" className="ml-1">
              {filters.mealTypes.length + (filters.showFavourites ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 pt-8">
          {/* Sort Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  sortBy: value as RecipeFiltersType["sortBy"],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="totalTime">Total Time</SelectItem>
                <SelectItem value="servings">Servings</SelectItem>
              </SelectContent>
            </Select>
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
          </div>

          {/* Show/Hide Options Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Display Options</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={filters.showFavourites}
                  onCheckedChange={(checked) =>
                    onFilterChange({ ...filters, showFavourites: checked })
                  }
                />
                <Label>Show Favorites Only</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={filters.hideDefaults}
                  onCheckedChange={(checked) =>
                    onFilterChange({ ...filters, hideDefaults: checked })
                  }
                />
                <Label>Hide Default Recipes</Label>
              </div>
            </div>
          </div>

          {/* Meal Types */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Meal Types</Label>
              <div className="flex gap-2">
                {!allMealTypesSelected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={selectAllMealTypes}
                    className="h-6 px-2 text-muted-foreground"
                  >
                    Select All
                  </Button>
                )}
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
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(MealType).map((type) => (
                <Badge
                  key={type}
                  variant={
                    filters.mealTypes.includes(type) ? "default" : "outline"
                  }
                  className="cursor-pointer justify-center"
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
      </SheetContent>
    </Sheet>
  );
}
