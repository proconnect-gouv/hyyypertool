import { Hono } from "hono";
import admin_router from "../routes/admin";
import domains_deliverability_router from "../routes/domains-deliverability";
import moderations_router from "../routes/moderations";
import organizations_router from "../routes/organizations";
import response_templates_router from "../routes/response-templates";
import users_router from "../routes/users";

export function create_router() {
  return new Hono()
    .route("/moderations", moderations_router)
    .route("/admin", admin_router)
    .route("/users", users_router)
    .route("/organizations", organizations_router)
    .route("/domains-deliverability", domains_deliverability_router)
    .route("/response-templates", response_templates_router);
}
