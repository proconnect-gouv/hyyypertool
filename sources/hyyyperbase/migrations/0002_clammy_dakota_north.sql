CREATE TABLE "response_templates" (
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" integer,
	CONSTRAINT "response_templates_label_unique" UNIQUE("label")
);
--> statement-breakpoint
ALTER TABLE "response_templates" ADD CONSTRAINT "response_templates_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
