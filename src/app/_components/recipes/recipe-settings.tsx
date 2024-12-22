// src/components/recipes/recipe-settings.tsx
"use client";

import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function RecipeSettings() {
  const utils = api.useUtils();

  // Add your mutations here
  const unhideAll = api.recipes.unhideAllDefaults.useMutation({
    onSuccess: () => {
      void utils.recipes.getAll.invalidate();
    },
  });

  const hideAll = api.recipes.hideAllDefaults.useMutation({
    onSuccess: () => {
      void utils.recipes.getAll.invalidate();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Recipe settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Recipe Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => unhideAll.mutate()}
            disabled={unhideAll.isPending}
          >
            Show All Default Recipes
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => hideAll.mutate()}
            disabled={hideAll.isPending}
          >
            Remove All Default Recipes
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Import Recipes</DropdownMenuItem>
          <DropdownMenuItem>Export Recipes</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
