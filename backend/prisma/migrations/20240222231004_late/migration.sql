/*
  Warnings:

  - You are about to drop the column `image` on the `UserChat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserChat" DROP COLUMN "image",
ADD COLUMN     "dmImage" TEXT,
ADD COLUMN     "dmName" TEXT;
