-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "creatorId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
