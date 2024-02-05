/*
  Warnings:

  - You are about to drop the column `friends` on the `User` table. All the data in the column will be lost.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserChat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserChat` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('Online', 'Offline', 'InGame');

-- CreateEnum
CREATE TYPE "friendStatus" AS ENUM ('Accepted', 'Rejected', 'Pending');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "friends",
ADD COLUMN     "twoFA" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'Online';

-- AlterTable
ALTER TABLE "UserChat" DROP CONSTRAINT "UserChat_pkey",
DROP COLUMN "id";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Friendship" (
    "friend1Id" INTEGER NOT NULL,
    "friend2Id" INTEGER NOT NULL,
    "status" "friendStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friend1Id","friend2Id")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend1Id_fkey" FOREIGN KEY ("friend1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend2Id_fkey" FOREIGN KEY ("friend2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
