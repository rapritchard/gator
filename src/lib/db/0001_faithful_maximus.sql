CREATE TABLE "feeds" (
	"name" text NOT NULL,
	"user_id" uuid,
	CONSTRAINT "feeds_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;