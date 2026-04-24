/*
  Warnings:

  - Made the column `userId` on table `AlertAndRecommendations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AlertAndRecommendations" ALTER COLUMN "userId" SET NOT NULL;
