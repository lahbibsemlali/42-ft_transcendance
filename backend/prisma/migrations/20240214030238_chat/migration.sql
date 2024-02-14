-- CreateEnum
CREATE TYPE "groupStatus" AS ENUM ('Private', 'Protected', 'Public');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "status" "groupStatus" NOT NULL DEFAULT 'Public';
