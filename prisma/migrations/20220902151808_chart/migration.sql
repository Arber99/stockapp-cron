-- CreateTable
CREATE TABLE "DailyChart" (
    "ticker" TEXT NOT NULL,
    "prices" DOUBLE PRECISION[],

    CONSTRAINT "DailyChart_pkey" PRIMARY KEY ("ticker")
);
