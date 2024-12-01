import { useState, useMemo } from "react";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Loader2,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
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

const DEFAULT_CATEGORIES = [
  "Produce",
  "Meat & Poultry",
  "Dairy & Eggs",
  "Pantry",
  "Grains & Pasta",
  "Spices & Seasonings",
  "Canned Goods",
  "Baking",
  "Frozen Foods",
  "Condiments",
  "Beverages",
  "Snacks",
];

interface IngredientComboboxProps {
  value?: string;
  onChange: (value: string) => void;
}

export function IngredientCombobox({
  value,
  onChange,
}: IngredientComboboxProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<
    (typeof ingredients)[number] | null
  >(null);

  const [search, setSearch] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const utils = api.useUtils();
  const { data: ingredients = [], isLoading } =
    api.ingredients.getAll.useQuery();

  // Get unique categories from existing ingredients
  const existingCategories = useMemo(() => {
    const categories = new Set(DEFAULT_CATEGORIES);
    ingredients.forEach((ingredient) => {
      if (ingredient.category) {
        categories.add(ingredient.category);
      }
    });
    return Array.from(categories).sort();
  }, [ingredients]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<
    (typeof ingredients)[number] | null
  >(null);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return existingCategories;
    return existingCategories.filter((cat) =>
      cat.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [existingCategories, categorySearch]);

  const createIngredient = api.ingredients.create.useMutation({
    onSuccess: async (data) => {
      onChange(data.id);
      setDialogOpen(false);
      setNewIngredient("");
      setCategory("");
      setCategorySearch("");
      setOpen(false);
      await utils.ingredients.getAll.invalidate();
    },
  });
  const editIngredient = api.ingredients.update.useMutation({
    onSuccess: async () => {
      setDialogOpen(false);
      setNewIngredient("");
      setCategory("");
      setCategorySearch("");
      setIsEditMode(false);
      setEditingIngredient(null);
      await utils.ingredients.getAll.invalidate();
    },
  });
  const deleteIngredient = api.ingredients.delete.useMutation({
    onSuccess: async () => {
      await utils.ingredients.getAll.invalidate();
    },
  });

  const openDialog = (ingredient?: (typeof ingredients)[number]) => {
    if (ingredient) {
      setIsEditMode(true);
      setEditingIngredient(ingredient);
      setNewIngredient(ingredient.name);
      setCategory(ingredient.category ?? "");
    } else {
      setIsEditMode(false);
      setEditingIngredient(null);
      setNewIngredient(search);
      setCategory("");
    }
    setDialogOpen(true);
    setOpen(false);
  };
  const handleSubmit = () => {
    if (isEditMode && editingIngredient) {
      editIngredient.mutate({
        id: editingIngredient.id,
        name: newIngredient,
        category: category || undefined,
      });
    } else {
      createIngredient.mutate({
        name: newIngredient,
        category: category || undefined,
      });
    }
  };

  const filteredIngredients = useMemo(() => {
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
                    <div
                      key={ingredient.id}
                      className="group relative flex items-center"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start pr-24" // Increased padding for two buttons
                        onClick={() => {
                          onChange(ingredient.id);
                          setOpen(false);
                        }}
                      >
                        <div className="flex w-full items-center gap-2">
                          <span className="flex items-center gap-2">
                            {value === ingredient.id && (
                              <Check className="h-4 w-4" />
                            )}
                            {ingredient.name}
                          </span>
                          {ingredient.category && (
                            <span className="text-xs text-muted-foreground">
                              ({ingredient.category})
                            </span>
                          )}
                        </div>
                      </Button>
                      <div className="absolute right-1 hidden gap-1 group-hover:flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDialog(ingredient);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIngredientToDelete(ingredient);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="mt-2 w-full justify-start"
                    onClick={() => openDialog()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ingredient</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete &quot;{ingredientToDelete?.name}
              &quot;?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setIngredientToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (ingredientToDelete) {
                  deleteIngredient.mutate({ id: ingredientToDelete.id });
                  setDeleteConfirmOpen(false);
                  setIngredientToDelete(null);
                }
              }}
              disabled={deleteIngredient.isPending}
            >
              {deleteIngredient.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit ingredient" : "Create new ingredient"}
          </DialogTitle>
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
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className="w-full justify-between"
                >
                  {category || "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 border-b p-2">
                    <Search className="h-4 w-4 opacity-50" />
                    <Input
                      placeholder="Search or add category..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <ScrollArea className="h-[200px]">
                    <div className="flex flex-col">
                      {filteredCategories.map((cat) => (
                        <Button
                          key={cat}
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            setCategory(cat);
                            setCategoryOpen(false);
                            setCategorySearch("");
                          }}
                        >
                          {category === cat && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          {cat}
                        </Button>
                      ))}
                      {categorySearch &&
                        !filteredCategories.includes(categorySearch) && (
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => {
                              setCategory(categorySearch);
                              setCategoryOpen(false);
                              setCategorySearch("");
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add &quot;{categorySearch}&quot;
                          </Button>
                        )}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={
              !newIngredient ||
              createIngredient.isPending ||
              editIngredient.isPending
            }
          >
            {createIngredient.isPending || editIngredient.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </span>
            ) : isEditMode ? (
              "Update Ingredient"
            ) : (
              "Create Ingredient"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
