ALTER TABLE "booking"
  ADD COLUMN "whatsappPhone" TEXT,
  ADD COLUMN "whatsappReminderConsentAt" TIMESTAMP(3),
  ADD COLUMN "whatsappReminderSentAt" TIMESTAMP(3),
  ADD COLUMN "whatsappReminderClaimedAt" TIMESTAMP(3);
