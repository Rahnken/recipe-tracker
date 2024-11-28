// src/components/recipes/recipe-card.tsx
"use client";

import { type Recipe, MealType } from "@prisma/client";
import { Clock, Users, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface RecipeCardProps {
  recipe: Recipe & {
    isfavourite: boolean;
  };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const utils = api.useUtils();
  const togglefavourite = api.recipes.togglefavourite.useMutation({
    onSuccess: () => {
      void utils.recipes.getAll.invalidate();
    },
  });

  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{recipe.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => togglefavourite.mutate({ recipeId: recipe.id })}
            disabled={togglefavourite.isPending}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                recipe.isfavourite
                  ? "fill-current text-red-500"
                  : "text-muted-foreground",
              )}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {totalTime > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {totalTime} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {recipe.servings} servings
            </span>
          </div>
          {recipe.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {recipe.description}
            </p>
          )}
        </div>
      </CardContent>
      <Link
        href={`/recipes/${recipe.id}`}
        className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className="sr-only">View recipe details</span>
      </Link>
    </Card>
  );
}
