/*
  Warnings:

  - You are about to drop the column `studentId` on the `AlertAndRecommendations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlertAndRecommendations" DROP CONSTRAINT "AlertAndRecommendations_studentId_fkey";

-- AlterTable
ALTER TABLE "AlertAndRecommendations" DROP COLUMN "studentId",
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "AlertAndRecommendations" ADD CONSTRAINT "AlertAndRecommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
