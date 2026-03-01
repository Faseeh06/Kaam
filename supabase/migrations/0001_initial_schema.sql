-- 0001_initial_schema.sql
-- Create the foundation for Kaam: Societies, Teams, Boards, and Roles.
-- This script is idempotent and can be run multiple times.

-- 1. SOCIETIES
CREATE TABLE IF NOT EXISTS societies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    acronym TEXT NOT NULL,
    logo TEXT, -- base64 or storage URL
    status TEXT DEFAULT 'Active',
    description TEXT,
    email TEXT, 
    website TEXT,
    whatsapp TEXT,
    accent_color TEXT DEFAULT 'bg-violet-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure missing columns exist in societies
ALTER TABLE societies ADD COLUMN IF NOT EXISTS members INTEGER DEFAULT 0;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS join_code TEXT UNIQUE;

-- 2. PROFILES (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    department TEXT,
    primary_team TEXT,
    is_global_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure missing columns exist in profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_team TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_global_admin BOOLEAN DEFAULT false;

-- 3. USER-SOCIETY MAPPING (Multi-Society Support)
CREATE TABLE IF NOT EXISTS user_societies (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'Member', -- 'Admin', 'Member'
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Active'
    PRIMARY KEY (user_id, society_id)
);

-- 4. TEAMS
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    type TEXT, -- 'Academic', 'Cultural', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure missing columns exist in teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS members INTEGER DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS leads TEXT[] DEFAULT '{}';

-- 5. TEAM MEMBERS & ROLES
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'Executive', -- 'Director', 'Deputy Director', 'HR', 'Executive'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(team_id, user_id)
);

-- 6. OFFICE BEARERS (Society Management)
CREATE TABLE IF NOT EXISTS office_bearers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
    position TEXT NOT NULL, -- 'President', 'General Secretary', etc.
    assigned_team_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. KANBAN BOARD SYSTEM
CREATE TABLE IF NOT EXISTS board_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS board_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES board_lists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    deadline DATE,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_completed BOOLEAN DEFAULT false,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_bearers ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_cards ENABLE ROW LEVEL SECURITY;

-- Additional Office Bearers Policy
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Global admins can manage office bearers') THEN
        CREATE POLICY "Global admins can manage office bearers" ON office_bearers 
        FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_global_admin = true)
        );
    END IF;
END $$;

-- 9. BASE POLICIES (Using DO blocks to avoid "already exists" errors)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles viewable by all authenticated users') THEN
        CREATE POLICY "Profiles viewable by all authenticated users" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can edit their own profile') THEN
        CREATE POLICY "Users can edit their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Societies viewable by all') THEN
        CREATE POLICY "Societies viewable by all" ON societies FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cards viewable by team members') THEN
        CREATE POLICY "Cards viewable by team members" ON board_cards FOR SELECT 
        USING (EXISTS (
            SELECT 1 FROM team_members 
            WHERE team_members.user_id = auth.uid() 
            AND team_members.team_id = (SELECT team_id FROM board_lists WHERE id = list_id)
        ));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view memberships') THEN
        CREATE POLICY "Authenticated users can view memberships" ON user_societies FOR SELECT USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Global admins can manage all memberships') THEN
        CREATE POLICY "Global admins can manage all memberships" ON user_societies 
        FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_global_admin = true)
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Society admins can manage their memberships') THEN
        CREATE POLICY "Society admins can manage their memberships" ON user_societies 
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM user_societies AS admins
                WHERE admins.user_id = auth.uid() 
                AND admins.society_id = user_societies.society_id
                AND admins.role NOT IN ('Member', 'User', 'Pending', 'Guest')
            )
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can join a society') THEN
        CREATE POLICY "Users can join a society" ON user_societies FOR INSERT WITH CHECK (user_id = auth.uid());
    END IF;

    -- ─── TEAMS POLICIES ───
    DROP POLICY IF EXISTS "Society admins can manage their teams" ON teams;
    DROP POLICY IF EXISTS "Society admins can view their teams" ON teams;
    DROP POLICY IF EXISTS "Manage teams" ON teams;
    CREATE POLICY "Manage teams" ON teams FOR ALL USING (
        (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_global_admin = true))
        OR
        (EXISTS (
            SELECT 1 FROM user_societies AS admins
            WHERE admins.user_id = auth.uid() 
            AND admins.society_id = teams.society_id
            AND admins.role NOT IN ('Member', 'User', 'Pending', 'Guest')
        ))
    );

    -- ─── BOARD LISTS POLICIES ───
    DROP POLICY IF EXISTS "Society admins can manage their lists" ON board_lists;
    DROP POLICY IF EXISTS "Society admins can view their lists" ON board_lists;
    DROP POLICY IF EXISTS "Manage lists" ON board_lists;
    CREATE POLICY "Manage lists" ON board_lists FOR ALL USING (
        (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_global_admin = true))
        OR
        (EXISTS (
            SELECT 1 FROM teams 
            JOIN user_societies AS admins ON teams.society_id = admins.society_id
            WHERE admins.user_id = auth.uid()
            AND teams.id = board_lists.team_id
            AND admins.role NOT IN ('Member', 'User', 'Pending', 'Guest')
        ))
    );

    -- ─── BOARD CARDS POLICIES ───
    DROP POLICY IF EXISTS "Society admins can manage their cards" ON board_cards;
    DROP POLICY IF EXISTS "Manage cards" ON board_cards;
    CREATE POLICY "Manage cards" ON board_cards FOR ALL USING (
        (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_global_admin = true))
        OR
        (EXISTS (
            SELECT 1 FROM board_lists
            JOIN teams ON board_lists.team_id = teams.id
            JOIN user_societies AS admins ON teams.society_id = admins.society_id
            WHERE admins.user_id = auth.uid()
            AND board_lists.id = board_cards.list_id
            AND admins.role NOT IN ('Member', 'User', 'Pending', 'Guest')
        ))
    );


END $$;
