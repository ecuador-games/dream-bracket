-- DreamBracket Database Schema
-- Supabase PostgreSQL Schema with RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'player');
CREATE TYPE tournament_status AS ENUM ('draft', 'active', 'finished');
CREATE TYPE match_round AS ENUM ('16', '8', '4', '2', '1');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'player' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournaments table
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status tournament_status DEFAULT 'draft' NOT NULL,
  settings JSONB DEFAULT '{"background": "default", "colors": {"primary": "#6366f1"}}'::jsonb,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournament participants (16 teams)
CREATE TABLE tournament_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  seed_number INTEGER CHECK (seed_number >= 1 AND seed_number <= 16),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, team_id),
  UNIQUE(tournament_id, seed_number)
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE NOT NULL,
  round match_round NOT NULL,
  position INTEGER NOT NULL,
  team1_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  team2_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  winner_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  next_match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  score_team1 INTEGER,
  score_team2 INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, round, position)
);

-- Indexes for performance
CREATE INDEX idx_teams_creator ON teams(creator_id);
CREATE INDEX idx_tournaments_creator ON tournaments(creator_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_round ON matches(round);

-- Trigger: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Teams policies
CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Organizers and admins can create teams"
  ON teams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

CREATE POLICY "Users can update own teams"
  ON teams FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Admins can update any team"
  ON teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete own teams"
  ON teams FOR DELETE
  USING (creator_id = auth.uid());

-- Tournaments policies
CREATE POLICY "Public tournaments are viewable by everyone"
  ON tournaments FOR SELECT
  USING (is_public = true OR creator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Organizers and admins can create tournaments"
  ON tournaments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

CREATE POLICY "Users can update own tournaments"
  ON tournaments FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Admins can update any tournament"
  ON tournaments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete own tournaments"
  ON tournaments FOR DELETE
  USING (creator_id = auth.uid());

-- Tournament participants policies
CREATE POLICY "Participants viewable if tournament is viewable"
  ON tournament_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE id = tournament_id AND (
        is_public = true OR creator_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Tournament creators can manage participants"
  ON tournament_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE id = tournament_id AND creator_id = auth.uid()
    )
  );

-- Matches policies
CREATE POLICY "Matches viewable if tournament is viewable"
  ON matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE id = tournament_id AND (
        is_public = true OR creator_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Tournament creators can manage matches"
  ON matches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE id = tournament_id AND creator_id = auth.uid()
    )
  );

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
