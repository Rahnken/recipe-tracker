import { PrismaClient, MealType, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_RECIPES: Array<Prisma.RecipeCreateInput> = [
  {
    name: "Classic Oatmeal",
    description: "Hearty breakfast oatmeal with optional toppings",
    servings: 1,
    prepTime: 2,
    cookTime: 5,
    mealType: [MealType.BREAKFAST],
    isDefault: true,
    createdBy: "system",
    ingredients: {
      create: [
        {
          quantity: 50,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Rolled Oats" },
              create: { name: "Rolled Oats" },
            },
          },
        },
        {
          quantity: 250,
          unit: "ml",
          ingredient: {
            connectOrCreate: {
              where: { name: "Water" },
              create: { name: "Water" },
            },
          },
        },
        {
          quantity: 0.25,
          unit: "teaspoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Salt" },
              create: { name: "Salt" },
            },
          },
        },
        {
          quantity: 1,
          unit: "tablespoon",
          notes: "optional",
          ingredient: {
            connectOrCreate: {
              where: { name: "Honey" },
              create: { name: "Honey" },
            },
          },
        },
        {
          quantity: 1,
          unit: "whole",
          notes: "optional",
          ingredient: {
            connectOrCreate: {
              where: { name: "Banana" },
              create: { name: "Banana" },
            },
          },
        },
      ],
    },
    instructions: {
      create: [
        { step: "Add oats and water to a microwave-safe bowl", orderIndex: 0 },
        { step: "Add a pinch of salt", orderIndex: 1 },
        { step: "Microwave for 2-3 minutes, stirring halfway", orderIndex: 2 },
        { step: "Add honey and sliced banana if desired", orderIndex: 3 },
      ],
    },
  },
  {
    name: "Scrambled Eggs on Toast",
    description: "Quick and protein-rich breakfast",
    servings: 1,
    prepTime: 5,
    cookTime: 5,
    mealType: [MealType.BREAKFAST],
    isDefault: true,
    createdBy: "system",
    ingredients: {
      create: [
        {
          quantity: 2,
          unit: "whole",
          ingredient: {
            connectOrCreate: {
              where: { name: "Eggs" },
              create: { name: "Eggs" },
            },
          },
        },
        {
          quantity: 30,
          unit: "ml",
          ingredient: {
            connectOrCreate: {
              where: { name: "Milk" },
              create: { name: "Milk" },
            },
          },
        },
        {
          quantity: 1,
          unit: "tablespoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Butter" },
              create: { name: "Butter" },
            },
          },
        },
        {
          quantity: 0.25,
          unit: "teaspoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Salt" },
              create: { name: "Salt" },
            },
          },
        },
        {
          quantity: 0.25,
          unit: "teaspoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Black Pepper" },
              create: { name: "Black Pepper" },
            },
          },
        },
        {
          quantity: 2,
          unit: "slices",
          ingredient: {
            connectOrCreate: {
              where: { name: "Bread" },
              create: { name: "Bread" },
            },
          },
        },
      ],
    },
    instructions: {
      create: [
        { step: "Beat eggs with milk, salt, and pepper", orderIndex: 0 },
        {
          step: "Melt butter in a non-stick pan over medium heat",
          orderIndex: 1,
        },
        {
          step: "Pour in egg mixture and stir gently until set",
          orderIndex: 2,
        },
        { step: "Toast bread while eggs are cooking", orderIndex: 3 },
        { step: "Serve eggs over toast", orderIndex: 4 },
      ],
    },
  },
  {
    name: "Chicken Caesar Salad",
    description: "Classic salad with grilled chicken and creamy dressing",
    servings: 2,
    prepTime: 15,
    cookTime: 15,
    mealType: [MealType.LUNCH],
    isDefault: true,
    createdBy: "system",
    ingredients: {
      create: [
        {
          quantity: 300,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Chicken Breast" },
              create: { name: "Chicken Breast" },
            },
          },
        },
        {
          quantity: 1,
          unit: "head",
          ingredient: {
            connectOrCreate: {
              where: { name: "Romaine Lettuce" },
              create: { name: "Romaine Lettuce" },
            },
          },
        },
        {
          quantity: 50,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Parmesan Cheese" },
              create: { name: "Parmesan Cheese" },
            },
          },
        },
        {
          quantity: 4,
          unit: "tablespoons",
          ingredient: {
            connectOrCreate: {
              where: { name: "Caesar Dressing" },
              create: { name: "Caesar Dressing" },
            },
          },
        },
        {
          quantity: 50,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Croutons" },
              create: { name: "Croutons" },
            },
          },
        },
        {
          quantity: 1,
          unit: "tablespoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Olive Oil" },
              create: { name: "Olive Oil" },
            },
          },
        },
        {
          quantity: 0.5,
          unit: "teaspoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Salt" },
              create: { name: "Salt" },
            },
          },
        },
        {
          quantity: 0.5,
          unit: "teaspoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Black Pepper" },
              create: { name: "Black Pepper" },
            },
          },
        },
      ],
    },
    instructions: {
      create: [
        { step: "Season chicken with salt and pepper", orderIndex: 0 },
        {
          step: "Heat olive oil in a pan and cook chicken until done",
          orderIndex: 1,
        },
        {
          step: "Chop romaine lettuce and place in a large bowl",
          orderIndex: 2,
        },
        { step: "Slice cooked chicken", orderIndex: 3 },
        {
          step: "Add chicken, croutons, and parmesan to lettuce",
          orderIndex: 4,
        },
        { step: "Toss with caesar dressing before serving", orderIndex: 5 },
      ],
    },
  },
  {
    name: "Spaghetti Bolognese",
    description: "Classic Italian pasta with meat sauce",
    servings: 4,
    prepTime: 15,
    cookTime: 45,
    mealType: [MealType.DINNER],
    isDefault: true,
    createdBy: "system",
    ingredients: {
      create: [
        {
          quantity: 400,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Spaghetti" },
              create: { name: "Spaghetti" },
            },
          },
        },
        {
          quantity: 500,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Ground Beef" },
              create: { name: "Ground Beef" },
            },
          },
        },
        {
          quantity: 1,
          unit: "whole",
          ingredient: {
            connectOrCreate: {
              where: { name: "Onion" },
              create: { name: "Onion" },
            },
          },
        },
        {
          quantity: 3,
          unit: "cloves",
          ingredient: {
            connectOrCreate: {
              where: { name: "Garlic" },
              create: { name: "Garlic" },
            },
          },
        },
        {
          quantity: 700,
          unit: "ml",
          ingredient: {
            connectOrCreate: {
              where: { name: "Tomato Sauce" },
              create: { name: "Tomato Sauce" },
            },
          },
        },
        {
          quantity: 2,
          unit: "tablespoons",
          ingredient: {
            connectOrCreate: {
              where: { name: "Olive Oil" },
              create: { name: "Olive Oil" },
            },
          },
        },
        {
          quantity: 1,
          unit: "teaspoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Salt" },
              create: { name: "Salt" },
            },
          },
        },
        {
          quantity: 0.5,
          unit: "teaspoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Black Pepper" },
              create: { name: "Black Pepper" },
            },
          },
        },
        {
          quantity: 1,
          unit: "teaspoon",
          ingredient: {
            connectOrCreate: {
              where: { name: "Dried Oregano" },
              create: { name: "Dried Oregano" },
            },
          },
        },
        {
          quantity: 50,
          unit: "grams",
          notes: "for serving",
          ingredient: {
            connectOrCreate: {
              where: { name: "Parmesan Cheese" },
              create: { name: "Parmesan Cheese" },
            },
          },
        },
      ],
    },
    instructions: {
      create: [
        { step: "Dice onion and mince garlic", orderIndex: 0 },
        { step: "Heat olive oil and cook onion until softened", orderIndex: 1 },
        { step: "Add garlic and cook for 1 minute", orderIndex: 2 },
        { step: "Add ground beef and cook until browned", orderIndex: 3 },
        { step: "Add tomato sauce, oregano, salt, and pepper", orderIndex: 4 },
        { step: "Simmer for 30 minutes", orderIndex: 5 },
        {
          step: "Cook spaghetti according to package instructions",
          orderIndex: 6,
        },
        { step: "Serve sauce over pasta with grated parmesan", orderIndex: 7 },
      ],
    },
  },
  {
    name: "Trail Mix",
    description: "Healthy snack mix of nuts and dried fruits",
    servings: 4,
    prepTime: 5,
    cookTime: 0,
    mealType: [MealType.SNACK],
    isDefault: true,
    createdBy: "system",
    ingredients: {
      create: [
        {
          quantity: 100,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Almonds" },
              create: { name: "Almonds" },
            },
          },
        },
        {
          quantity: 100,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Cashews" },
              create: { name: "Cashews" },
            },
          },
        },
        {
          quantity: 50,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Raisins" },
              create: { name: "Raisins" },
            },
          },
        },
        {
          quantity: 50,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Dried Cranberries" },
              create: { name: "Dried Cranberries" },
            },
          },
        },
        {
          quantity: 50,
          unit: "grams",
          ingredient: {
            connectOrCreate: {
              where: { name: "Dark Chocolate Chips" },
              create: { name: "Dark Chocolate Chips" },
            },
          },
        },
      ],
    },
    instructions: {
      create: [
        { step: "Combine all ingredients in a large bowl", orderIndex: 0 },
        { step: "Mix well", orderIndex: 1 },
        { step: "Store in an airtight container", orderIndex: 2 },
      ],
    },
  },
];

async function seed() {
  console.log("Starting seed...");

  try {
    for (const recipeData of DEFAULT_RECIPES) {
      const recipe = await prisma.recipe.create({
        data: recipeData,
      });

      console.log(`Created recipe: ${recipe.name}`);
    }

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error during seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
