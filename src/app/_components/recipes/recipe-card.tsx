// src/components/recipes/recipe-card.tsx
"use client";

import { Clock, Users, Heart, Eye, Pencil, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { RecipeEditDialog } from "./recipe-edit-dialog";
import { RecipeShareDialog } from "./recipe-share-dialog";
import { type RecipeWithDetails } from "~/server/api/routers/recipe";

interface RecipeCardProps {
  recipe: RecipeWithDetails;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const utils = api.useUtils();
  const togglefavourite = api.recipes.toggleFavourite.useMutation({
    onSuccess: () => {
      void utils.recipes.getAll.invalidate();
    },
  });
  const toggleHidden = api.recipes.toggleHidden.useMutation({
    onSuccess: () => {
      void utils.recipes.getAll.invalidate();
    },
  });

  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader
        className={cn(
          "border-b pb-4",
          recipe.isDefault
            ? "bg-muted/30 dark:bg-muted/20" // Uses theme tokens for a subtle tan/beige
            : "bg-muted/50",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href={`/recipes/${recipe.id}`} className="w-full">
            <CardTitle className="line-clamp-2 flex items-center gap-2">
              <span className="sr-only">View recipe details</span>
              {recipe.name}
              {recipe.isDefault && (
                <Badge variant="outline" className="text-xs font-normal">
                  Default Recipe
                </Badge>
              )}
            </CardTitle>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            {recipe.mealType.map((mealType) => (
              <Badge key={recipe.name + mealType} variant="secondary">
                {mealType.charAt(0) + mealType.slice(1).toLowerCase()}
              </Badge>
            ))}
          </div>
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
                recipe.isFavourite
                  ? "fill-current text-red-500"
                  : "text-muted-foreground transition-colors hover:text-red-500",
              )}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="bg-background p-4">
        <div className="flex items-center gap-4">
          {recipe.description && (
            <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
              {recipe.description}
            </p>
          )}
          <div className="flex shrink-0 flex-col items-center gap-4 text-sm text-muted-foreground">
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
        </div>
        {/* Hover Actions */}
        <div className="absolute bottom-2 left-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {recipe.isDefault ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleHidden.mutate({ recipeId: recipe.id })}
                disabled={toggleHidden.isPending}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Hide default recipe</span>
              </Button>
              <RecipeShareDialog
                recipeId={recipe.id}
                trigger={
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share recipe</span>
                  </Button>
                }
              />
            </>
          ) : (
            <>
              <RecipeEditDialog
                recipe={recipe}
                trigger={
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit recipe</span>
                  </Button>
                }
              />
              <RecipeShareDialog
                recipeId={recipe.id}
                trigger={
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share recipe</span>
                  </Button>
                }
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
