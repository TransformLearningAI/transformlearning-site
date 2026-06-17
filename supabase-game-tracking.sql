-- Game tracking — run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS game_plays (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL,
  ending text NOT NULL,
  enrollment integer,
  morale integer,
  community_trust integer,
  donor_confidence integer,
  board_unity integer,
  discount_rate integer,
  choices jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_plays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert" ON game_plays FOR INSERT WITH CHECK (true);
CREATE POLICY "service_read" ON game_plays FOR SELECT USING (true);
