/*
  Warnings:

  - You are about to drop the `DailyChart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DailyChart";

-- CreateTable
CREATE TABLE "dailyChart" (
    "ticker" TEXT NOT NULL,
    "prices" DOUBLE PRECISION[],

    CONSTRAINT "dailyChart_pkey" PRIMARY KEY ("ticker")
);
