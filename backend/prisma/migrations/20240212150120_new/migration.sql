/*
  Warnings:

  - Added the required column `image` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "image" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
