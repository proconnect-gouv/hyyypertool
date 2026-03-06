CREATE TABLE "users" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"disabled_at" timestamp,
	"email" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'visitor' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
