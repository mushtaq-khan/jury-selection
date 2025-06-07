/*
  Warnings:

  - Added the required column `userId` to the `Juror` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column as nullable
ALTER TABLE "Juror" ADD COLUMN "userId" INTEGER;

-- Update existing records to link to the first user (or appropriate user)
UPDATE "Juror" SET "userId" = (SELECT id FROM "User" LIMIT 1);

-- Make the column required
ALTER TABLE "Juror" ALTER COLUMN "userId" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "Juror" ADD CONSTRAINT "Juror_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
