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
-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  segment text NOT NULL,
  brand_voice text DEFAULT '',
  target_audience text DEFAULT '',
  platforms text[] DEFAULT '{"instagram"}',
  preferred_formats text[] DEFAULT '{"reels"}',
  notes text DEFAULT '',
  color text DEFAULT '#6366f1',
  created_at timestamptz DEFAULT now()
);

-- Briefs
CREATE TABLE IF NOT EXISTS briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  raw_briefing text NOT NULL,
  decoded_result jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Copy History
CREATE TABLE IF NOT EXISTS copy_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  module text NOT NULL DEFAULT 'musa',
  prompt text NOT NULL,
  result jsonb NOT NULL,
  copy_type text,
  tone text,
  platform text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  module text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Calendar Entries
CREATE TABLE IF NOT EXISTS calendar_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  title text NOT NULL,
  platform text NOT NULL,
  format text DEFAULT 'reels',
  scheduled_date date NOT NULL,
  status text DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'agendado', 'publicado')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_copy_history_created_at ON copy_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_entries_date ON calendar_entries(scheduled_date);

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on clients') THEN
    CREATE POLICY "Allow all on clients" ON clients FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on briefs') THEN
    CREATE POLICY "Allow all on briefs" ON briefs FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on copy_history') THEN
    CREATE POLICY "Allow all on copy_history" ON copy_history FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on activities') THEN
    CREATE POLICY "Allow all on activities" ON activities FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on calendar_entries') THEN
    CREATE POLICY "Allow all on calendar_entries" ON calendar_entries FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`;

async function run() {
  await client.connect();
  console.log("Connected to Supabase database");

  await client.query(SCHEMA);
  console.log("Schema created successfully");

  // Verify tables
  const { rows } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN ('clients','briefs','copy_history','activities','calendar_entries')
    ORDER BY table_name
  `);
  console.log("Tables created:", rows.map((r) => r.table_name).join(", "));

  await client.end();
}

run().catch((e) => {
  console.error("Migration failed:", e.message);
  process.exit(1);
});
