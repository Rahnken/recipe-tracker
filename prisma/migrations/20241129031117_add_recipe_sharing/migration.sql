-- CreateEnum
CREATE TYPE "RecipePermission" AS ENUM ('VIEW', 'EDIT');

-- CreateTable
CREATE TABLE "RecipeShare" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "RecipePermission" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeShare_userId_idx" ON "RecipeShare"("userId");

-- CreateIndex
CREATE INDEX "RecipeShare_recipeId_idx" ON "RecipeShare"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeShare_recipeId_userId_key" ON "RecipeShare"("recipeId", "userId");

-- AddForeignKey
ALTER TABLE "RecipeShare" ADD CONSTRAINT "RecipeShare_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
