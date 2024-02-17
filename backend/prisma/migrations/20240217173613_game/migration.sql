/*
  Warnings:

  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'Online';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status";
