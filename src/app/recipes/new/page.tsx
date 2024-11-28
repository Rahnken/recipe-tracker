// src/app/recipes/new/page.tsx
import { RecipeForm } from "~/app/_components/recipes/recipe-form";

export default function NewRecipePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Recipe</h1>
        <p className="text-muted-foreground">
          Add a new recipe to your collection
        </p>
      </div>
      <RecipeForm />
    </div>
  );
}
