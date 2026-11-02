-- Allow reservations without a registered account and store guest contact details.
ALTER TABLE "booking" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "booking" ADD COLUMN "customerName" TEXT;
ALTER TABLE "booking" ADD COLUMN "customerPhone" TEXT;
