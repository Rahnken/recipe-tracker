// src/components/recipes/recipe-form.tsx
"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

import { type RecipeFormData, recipeFormSchema } from "~/lib/schemas/recipe";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card } from "~/components/ui/card";

import { MealType } from "@prisma/client";
import { IngredientCombobox } from "./ingredient-combobox";
import { MealTypeSelect } from "./mealtype-multiselect";

interface RecipeFormProps {
  defaultValues?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function RecipeForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: RecipeFormProps) {
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      servings: 1,
      mealType: [],
      ingredients: [],
      instructions: [],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
    move: moveInstruction,
  } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Name</FormLabel>
                <FormControl>
                  <Input placeholder="Recipe name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Times Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="prepTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prep Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cookTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cook Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Description & Source */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Recipe description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sourceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Types</FormLabel>
              <FormControl>
                <MealTypeSelect
                  options={Object.values(MealType)}
                  selected={field.value ?? []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Ingredients Section */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Ingredients</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendIngredient({
                  id: "",
                  recipeId: "",
                  ingredientId: "", // or undefined
                  quantity: 0,
                  unit: "",
                  notes: "",
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {ingredientFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.ingredientId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ingredient</FormLabel>
                        <FormControl>
                          <IngredientCombobox
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Instructions</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendInstruction({
                  id: "",
                  recipeId: "",
                  step: "",
                  orderIndex: instructionFields.length,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {instructionFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex gap-4">
                  <div className="flex flex-col justify-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveInstruction(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveInstruction(index, index + 1)}
                      disabled={index === instructionFields.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`instructions.${index}.step`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Step {index + 1}</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <input
                      type="hidden"
                      {...form.register(`instructions.${index}.orderIndex`)}
                      value={index}
                    />
                  </div>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeInstruction(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            Create Recipe
          </Button>
        </div>
      </form>
    </Form>
  );
}
