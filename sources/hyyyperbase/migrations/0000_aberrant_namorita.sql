CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'visitor' NOT NULL,
	"disabled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "admin_all" ON "users" AS PERMISSIVE FOR ALL TO public USING (current_setting('app.role', true) = 'admin') WITH CHECK (current_setting('app.role', true) = 'admin');--> statement-breakpoint
CREATE POLICY "god_all" ON "users" AS PERMISSIVE FOR ALL TO public USING (current_setting('app.role', true) = 'god') WITH CHECK (current_setting('app.role', true) = 'god');--> statement-breakpoint
CREATE POLICY "self_select" ON "users" AS PERMISSIVE FOR SELECT TO public USING (NULLIF(current_setting('app.user_id', true), '')::int = "users"."id");--> statement-breakpoint
CREATE POLICY "self_update" ON "users" AS PERMISSIVE FOR UPDATE TO public USING (NULLIF(current_setting('app.user_id', true), '')::int = "users"."id") WITH CHECK (NULLIF(current_setting('app.user_id', true), '')::int = "users"."id");--> statement-breakpoint
CREATE POLICY "moderator_select" ON "users" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.role', true) = 'moderator' AND "users"."disabled_at" IS NULL);--> statement-breakpoint
CREATE POLICY "no_self_delete" ON "users" AS RESTRICTIVE FOR DELETE TO public USING (NULLIF(current_setting('app.user_id', true), '') IS NULL OR NULLIF(current_setting('app.user_id', true), '')::int != "users"."id");