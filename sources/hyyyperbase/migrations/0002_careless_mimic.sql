CREATE TABLE "response_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer
);
