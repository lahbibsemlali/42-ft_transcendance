-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Online', 'Offline', 'InGame');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Online';
