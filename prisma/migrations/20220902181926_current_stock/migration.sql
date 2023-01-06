-- CreateTable
CREATE TABLE "CurrentStock" (
    "ticker" TEXT NOT NULL,
    "bp" DOUBLE PRECISION NOT NULL,
    "ap" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CurrentStock_pkey" PRIMARY KEY ("ticker")
);
