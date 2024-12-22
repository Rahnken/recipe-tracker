-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "HiddenDefaultRecipe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "hiddenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HiddenDefaultRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HiddenDefaultRecipe_userId_idx" ON "HiddenDefaultRecipe"("userId");

-- CreateIndex
CREATE INDEX "HiddenDefaultRecipe_recipeId_idx" ON "HiddenDefaultRecipe"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "HiddenDefaultRecipe_userId_recipeId_key" ON "HiddenDefaultRecipe"("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "HiddenDefaultRecipe" ADD CONSTRAINT "HiddenDefaultRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
