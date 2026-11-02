-- Restore the original booking schema after reverting guest reservations.
ALTER TABLE "booking" DROP COLUMN "customerName";
ALTER TABLE "booking" DROP COLUMN "customerPhone";
ALTER TABLE "booking" ALTER COLUMN "userId" SET NOT NULL;
