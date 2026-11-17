CREATE TABLE "barbershopClosedDay" (
  "id" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "barbershopId" TEXT NOT NULL,

  CONSTRAINT "barbershopClosedDay_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "barbershopClosedDay_barbershopId_date_key"
  ON "barbershopClosedDay"("barbershopId", "date");

ALTER TABLE "barbershopClosedDay"
  ADD CONSTRAINT "barbershopClosedDay_barbershopId_fkey"
  FOREIGN KEY ("barbershopId") REFERENCES "barbershop"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
