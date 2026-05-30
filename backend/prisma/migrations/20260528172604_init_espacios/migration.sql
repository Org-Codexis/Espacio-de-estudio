/*
  Warnings:

  - Made the column `peopleCount` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "peopleCount" SET NOT NULL,
ALTER COLUMN "peopleCount" SET DEFAULT 1;
