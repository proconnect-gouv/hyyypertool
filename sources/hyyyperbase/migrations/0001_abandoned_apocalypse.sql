ALTER TABLE "users" ADD COLUMN "sub" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_sub_unique" UNIQUE("sub");