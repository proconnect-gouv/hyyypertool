//

import { migrate } from "@proconnect-gouv/proconnect.identite.database/pg/migrator";
import { Client } from "pg";

export const connection = new Client({
  connectionString:
    process.env["DATABASE_URL"] ??
    "postgresql://postgres:postgres@localhost:5432/postgres",
});
await connection.connect();

await migrate(connection);

await connection.end();
