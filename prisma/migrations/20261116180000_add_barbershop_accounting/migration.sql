ALTER TABLE "booking"
  ADD COLUMN "paidAt" TIMESTAMP(3),
  ADD COLUMN "paidAmount" DECIMAL(10,2),
  ADD COLUMN "paymentMethod" TEXT;

CREATE TABLE "barbershopExpense" (
  "id" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "barbershopId" TEXT NOT NULL,

  CONSTRAINT "barbershopExpense_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "barbershopExpense_barbershopId_date_idx"
  ON "barbershopExpense"("barbershopId", "date");

ALTER TABLE "barbershopExpense"
  ADD CONSTRAINT "barbershopExpense_barbershopId_fkey"
  FOREIGN KEY ("barbershopId") REFERENCES "barbershop"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
