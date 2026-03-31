import pg from "pg";

const client = new pg.Client({
  host: "aws-0-us-west-2.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.dfuyqhhjwqfduyczmlkh",
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const SCHEMA = `
-- Page Views / Analytics
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  visitor_id text NOT NULL,
  session_id text NOT NULL,
  ip_hash text,
  user_agent text,
  referrer text,
  country text,
  city text,
  region text,
  is_bot boolean DEFAULT false,
  is_first_visit boolean DEFAULT false,
  device_type text,
  browser text,
  os text,
  screen_width integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_is_bot ON page_views(is_bot);

-- RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "page_views_public" ON page_views;
CREATE POLICY "page_views_public" ON page_views FOR ALL USING (true) WITH CHECK (true);
`;

async function main() {
  await client.connect();
  console.log("Connected to database");

  await client.query(SCHEMA);
  console.log("Analytics table created successfully");

  await client.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
