-- DropIndex
DROP INDEX "Friendship_friend1Id_friend2Id_key";

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id");
