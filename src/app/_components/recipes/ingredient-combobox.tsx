"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Loader2, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { ScrollArea } from "~/components/ui/scroll-area";

interface IngredientComboboxProps {
  value?: string;
  onChange: (value: string) => void;
}

export function IngredientCombobox({
  value,
  onChange,
}: IngredientComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [newIngredient, setNewIngredient] = React.useState("");

  const utils = api.useUtils();
  const { data: ingredients = [], isLoading } =
    api.ingredients.getAll.useQuery();

  const createIngredient = api.ingredients.create.useMutation({
    onSuccess: async (data) => {
      onChange(data.id);
      setDialogOpen(false);
      setNewIngredient("");
      setOpen(false);
      await utils.ingredients.getAll.invalidate();
    },
  });

  const handleCreateIngredient = () => {
    if (newIngredient) {
      createIngredient.mutate({ name: newIngredient });
    }
  };

  const filteredIngredients = React.useMemo(() => {
    if (!ingredients) return [];
    if (!search) return ingredients;
    return ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [ingredients, search]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              <span>
                {value
                  ? ingredients.find((ingredient) => ingredient.id === value)
                      ?.name
                  : "Select ingredient..."}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 border-b p-2">
              <Search className="h-4 w-4 opacity-50" />
              <Input
                placeholder="Search ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 focus-visible:ring-0"
              />
            </div>
            <ScrollArea className="h-[200px]">
              {filteredIngredients.length === 0 ? (
                <div className="p-2">
                  <p className="text-sm text-muted-foreground">
                    No ingredients found
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2 w-full justify-start"
                    onClick={() => {
                      setNewIngredient(search);
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredIngredients.map((ingredient) => (
                    <Button
                      key={ingredient.id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        onChange(ingredient.id);
                        setOpen(false);
                      }}
                    >
                      {value === ingredient.id && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {ingredient.name}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      setDialogOpen(true);
                      setOpen(false);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add new ingredient
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new ingredient</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Enter ingredient name"
            />
          </div>
          <Button
            onClick={handleCreateIngredient}
            disabled={!newIngredient || createIngredient.isPending}
          >
            {createIngredient.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Ingredient"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
