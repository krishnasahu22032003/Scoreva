-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "creatorId" DROP DEFAULT;
DROP SEQUENCE "Match_creatorId_seq";
