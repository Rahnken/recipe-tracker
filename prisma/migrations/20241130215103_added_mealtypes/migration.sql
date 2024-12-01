/*
  Warnings:

  - Changed the column `mealType` on the `Recipe` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MealType" ADD VALUE 'DRINK';
ALTER TYPE "MealType" ADD VALUE 'MAIN';
ALTER TYPE "MealType" ADD VALUE 'SIDE';
ALTER TYPE "MealType" ADD VALUE 'APPETIZER';
ALTER TYPE "MealType" ADD VALUE 'DESSERT';
ALTER TYPE "MealType" ADD VALUE 'QUICK';
ALTER TYPE "MealType" ADD VALUE 'SLOWCOOKER';


-- First, create a temporary column with the array type
ALTER TABLE "Recipe" 
ADD COLUMN "mealTypes" "MealType"[];

-- Update the new column with an array containing the old value
UPDATE "Recipe" 
SET "mealTypes" = ARRAY["mealType"];

-- Drop the old column
ALTER TABLE "Recipe" 
DROP COLUMN "mealType";

-- Rename the new column to the original name
ALTER TABLE "Recipe" 
RENAME COLUMN "mealTypes" TO "mealType";
