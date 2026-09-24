ALTER TABLE "feeds" ALTER COLUMN "last_fetched_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "feeds" ADD COLUMN "updated_at" timestamp;