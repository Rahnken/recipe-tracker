/*
  Warnings:

  - Added the required column `mealType` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "mealType" "MealType" NOT NULL;

-- CreateTable
CREATE TABLE "UserFavouriteRecipe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavouriteRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeInstruction" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "RecipeInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserFavouriteRecipe_userId_idx" ON "UserFavouriteRecipe"("userId");

-- CreateIndex
CREATE INDEX "UserFavouriteRecipe_recipeId_idx" ON "UserFavouriteRecipe"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteRecipe_userId_recipeId_key" ON "UserFavouriteRecipe"("userId", "recipeId");

-- CreateIndex
CREATE INDEX "RecipeInstruction_recipeId_idx" ON "RecipeInstruction"("recipeId");

-- CreateIndex
CREATE INDEX "RecipeInstruction_recipeId_orderIndex_idx" ON "RecipeInstruction"("recipeId", "orderIndex");

-- AddForeignKey
ALTER TABLE "UserFavouriteRecipe" ADD CONSTRAINT "UserFavouriteRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeInstruction" ADD CONSTRAINT "RecipeInstruction_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
