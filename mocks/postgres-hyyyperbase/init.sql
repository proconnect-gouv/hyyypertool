-- Match production: hyyypertool is a regular user (non-superuser) that owns the database.
-- FORCE RLS applies to the table owner, so RLS policies are enforced.
CREATE USER hyyypertool WITH PASSWORD 'hyyypertool';
GRANT ALL PRIVILEGES ON DATABASE hyyyperbase TO hyyypertool;

-- Required for hyyypertool to create tables in the public schema (PG 15+)
\connect hyyyperbase
GRANT ALL ON SCHEMA public TO hyyypertool;
