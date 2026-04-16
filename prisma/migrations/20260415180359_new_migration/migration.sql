-- AlterEnum
ALTER TYPE "AlerType" ADD VALUE 'ANNOUNCEMENT';

-- AlterEnum
ALTER TYPE "TriggerReason" ADD VALUE 'NEW_CONTENT';

-- AlterTable
ALTER TABLE "AlertAndRecommendations" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "academicYear" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "AuthorizedStudent" (
    "id" SERIAL NOT NULL,
    "universityId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AuthorizedStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorizedStuff" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AuthorizedStuff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizedStudent_universityId_key" ON "AuthorizedStudent"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizedStuff_employeeId_key" ON "AuthorizedStuff"("employeeId");
