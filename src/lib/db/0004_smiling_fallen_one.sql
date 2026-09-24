ALTER TABLE "feeds" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feeds" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;