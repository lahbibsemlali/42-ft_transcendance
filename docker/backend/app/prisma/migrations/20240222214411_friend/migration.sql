/*
  Warnings:

  - The primary key for the `Friendship` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[friend1Id,friend2Id]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_friend1Id_friend2Id_key" ON "Friendship"("friend1Id", "friend2Id");
