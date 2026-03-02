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
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS society_code TEXT;

    -- 3. USER-SOCIETY MAPPING (Multi-Society Support)
    CREATE TABLE IF NOT EXISTS user_societies (
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
        role TEXT DEFAULT 'Executive', -- 'Admin', 'Executive'
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

    -- Helper function to check global admin status without recursion
    CREATE OR REPLACE FUNCTION public.check_is_global_admin()
    RETURNS BOOLEAN AS $$
    BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_global_admin = true
    );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

    -- Helper function to check society admin status without recursion
    CREATE OR REPLACE FUNCTION public.check_is_society_admin(s_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_societies 
        WHERE user_id = auth.uid() 
        AND society_id = s_id 
        AND role NOT IN ('Executive', 'User', 'Pending', 'Guest')
        AND status = 'Active'
    );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

    -- Helper function to check society membership without recursion
    CREATE OR REPLACE FUNCTION public.check_is_society_member(s_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_societies 
        WHERE user_id = auth.uid() 
        AND society_id = s_id
    );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

    -- Helper function to check team membership without recursion
    CREATE OR REPLACE FUNCTION public.check_is_team_member(t_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE user_id = auth.uid() 
        AND team_id = t_id
    );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


    ALTER TABLE societies ENABLE ROW LEVEL SECURITY;    
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_societies ENABLE ROW LEVEL SECURITY;
    ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
    ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
    ALTER TABLE office_bearers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE board_lists ENABLE ROW LEVEL SECURITY;
    ALTER TABLE board_cards ENABLE ROW LEVEL SECURITY;

    -- POLICIES

    -- SOCIETIES
    DROP POLICY IF EXISTS "Societies viewable by all" ON societies;
    CREATE POLICY "Societies viewable by all" ON societies FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Global admins can manage societies" ON societies;
    DROP POLICY IF EXISTS "Global admins can insert societies" ON societies;
    CREATE POLICY "Global admins can insert societies" ON societies FOR INSERT WITH CHECK (check_is_global_admin());
    DROP POLICY IF EXISTS "Global admins can update societies" ON societies;
    CREATE POLICY "Global admins can update societies" ON societies FOR UPDATE USING (check_is_global_admin());
    DROP POLICY IF EXISTS "Society admins can update their society" ON societies;
    CREATE POLICY "Society admins can update their society" ON societies FOR UPDATE USING (check_is_society_admin(id));
    DROP POLICY IF EXISTS "Global admins can delete societies" ON societies;
    CREATE POLICY "Global admins can delete societies" ON societies FOR DELETE USING (check_is_global_admin());

    -- PROFILES
    DROP POLICY IF EXISTS "Profiles viewable by all authenticated users" ON profiles;
    CREATE POLICY "Profiles viewable by all authenticated users" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
    DROP POLICY IF EXISTS "Users can edit their own profile" ON profiles;
    CREATE POLICY "Users can edit their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    DROP POLICY IF EXISTS "Global admins can manage profiles" ON profiles;
    DROP POLICY IF EXISTS "Global admins can insert profiles" ON profiles;
    CREATE POLICY "Global admins can insert profiles" ON profiles FOR INSERT WITH CHECK (check_is_global_admin());
    DROP POLICY IF EXISTS "Global admins can update profiles" ON profiles;
    CREATE POLICY "Global admins can update profiles" ON profiles FOR UPDATE USING (check_is_global_admin());
    DROP POLICY IF EXISTS "Global admins can delete profiles" ON profiles;
    CREATE POLICY "Global admins can delete profiles" ON profiles FOR DELETE USING (check_is_global_admin());

    -- USER SOCIETIES
    DROP POLICY IF EXISTS "Authenticated users can view memberships" ON user_societies;
    CREATE POLICY "Authenticated users can view memberships" ON user_societies FOR SELECT USING (auth.role() = 'authenticated');
    DROP POLICY IF EXISTS "Users can join a society" ON user_societies;
    CREATE POLICY "Users can join a society" ON user_societies FOR INSERT WITH CHECK (user_id = auth.uid());
    DROP POLICY IF EXISTS "Global admins can insert memberships" ON user_societies;
    CREATE POLICY "Global admins can insert memberships" ON user_societies FOR INSERT WITH CHECK (check_is_global_admin());
    DROP POLICY IF EXISTS "Global admins can update memberships" ON user_societies;
    CREATE POLICY "Global admins can update memberships" ON user_societies FOR UPDATE USING (check_is_global_admin());
    DROP POLICY IF EXISTS "Global admins can delete memberships" ON user_societies;
    CREATE POLICY "Global admins can delete memberships" ON user_societies FOR DELETE USING (check_is_global_admin());
    DROP POLICY IF EXISTS "Society admins insert memberships" ON user_societies;
    CREATE POLICY "Society admins insert memberships" ON user_societies FOR INSERT WITH CHECK (check_is_society_admin(society_id));
    DROP POLICY IF EXISTS "Society admins update memberships" ON user_societies;
    CREATE POLICY "Society admins update memberships" ON user_societies FOR UPDATE USING (check_is_society_admin(society_id));
    DROP POLICY IF EXISTS "Society admins delete memberships" ON user_societies;
    CREATE POLICY "Society admins delete memberships" ON user_societies FOR DELETE USING (check_is_society_admin(society_id));

    -- TEAMS
    DROP POLICY IF EXISTS "Manage teams INSERT" ON teams;
    CREATE POLICY "Manage teams INSERT" ON teams FOR INSERT WITH CHECK (check_is_global_admin() OR check_is_society_admin(society_id));
    DROP POLICY IF EXISTS "Manage teams UPDATE" ON teams;
    CREATE POLICY "Manage teams UPDATE" ON teams FOR UPDATE USING (check_is_global_admin() OR check_is_society_admin(society_id));
    DROP POLICY IF EXISTS "Manage teams DELETE" ON teams;
    CREATE POLICY "Manage teams DELETE" ON teams FOR DELETE USING (check_is_global_admin() OR check_is_society_admin(society_id));
    DROP POLICY IF EXISTS "Teams viewable by society members" ON teams;
    CREATE POLICY "Teams viewable by society members" ON teams FOR SELECT USING (check_is_global_admin() OR check_is_society_member(society_id));

    -- BOARD LISTS
    DROP POLICY IF EXISTS "Manage lists INSERT" ON board_lists;
    CREATE POLICY "Manage lists INSERT" ON board_lists FOR INSERT WITH CHECK (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = board_lists.team_id)));
    DROP POLICY IF EXISTS "Manage lists UPDATE" ON board_lists;
    CREATE POLICY "Manage lists UPDATE" ON board_lists FOR UPDATE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = board_lists.team_id)));
    DROP POLICY IF EXISTS "Manage lists DELETE" ON board_lists;
    CREATE POLICY "Manage lists DELETE" ON board_lists FOR DELETE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = board_lists.team_id)));
    DROP POLICY IF EXISTS "Lists viewable by society members" ON board_lists;
    CREATE POLICY "Lists viewable by society members" ON board_lists FOR SELECT USING (check_is_global_admin() OR check_is_society_member((SELECT society_id FROM teams WHERE id = board_lists.team_id)));

    -- BOARD CARDS
    DROP POLICY IF EXISTS "Manage cards INSERT" ON board_cards;
    CREATE POLICY "Manage cards INSERT" ON board_cards FOR INSERT WITH CHECK (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = (SELECT team_id FROM board_lists WHERE id = board_cards.list_id))));
    DROP POLICY IF EXISTS "Manage cards UPDATE" ON board_cards;
    CREATE POLICY "Manage cards UPDATE" ON board_cards FOR UPDATE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = (SELECT team_id FROM board_lists WHERE id = board_cards.list_id))));
    DROP POLICY IF EXISTS "Manage cards DELETE" ON board_cards;
    CREATE POLICY "Manage cards DELETE" ON board_cards FOR DELETE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = (SELECT team_id FROM board_lists WHERE id = board_cards.list_id))));
    DROP POLICY IF EXISTS "Cards viewable by team members" ON board_cards;
    DROP POLICY IF EXISTS "Cards viewable by society members" ON board_cards;
    CREATE POLICY "Cards viewable by society members" ON board_cards FOR SELECT USING (check_is_global_admin() OR check_is_society_member((SELECT society_id FROM teams WHERE id = (SELECT team_id FROM board_lists WHERE id = board_cards.list_id))));

    -- TEAM MEMBERS
    DROP POLICY IF EXISTS "Authenticated users can view team memberships" ON team_members;
    CREATE POLICY "Authenticated users can view team memberships" ON team_members FOR SELECT USING (auth.role() = 'authenticated');
    DROP POLICY IF EXISTS "Manage team memberships INSERT" ON team_members;
    CREATE POLICY "Manage team memberships INSERT" ON team_members FOR INSERT WITH CHECK (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = team_members.team_id)));
    DROP POLICY IF EXISTS "Manage team memberships UPDATE" ON team_members;
    CREATE POLICY "Manage team memberships UPDATE" ON team_members FOR UPDATE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = team_members.team_id)));
    DROP POLICY IF EXISTS "Manage team memberships DELETE" ON team_members;
    CREATE POLICY "Manage team memberships DELETE" ON team_members FOR DELETE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = team_members.team_id)));

    -- OFFICE BEARERS
    DROP POLICY IF EXISTS "Global admins can manage office bearers" ON office_bearers;
    DROP POLICY IF EXISTS "Global admins can insert office bearers" ON office_bearers;
    CREATE POLICY "Global admins can insert office bearers" ON office_bearers FOR INSERT WITH CHECK (check_is_global_admin());
    DROP POLICY IF EXISTS "Global admins can update office bearers" ON office_bearers;
    CREATE POLICY "Global admins can update office bearers" ON office_bearers FOR UPDATE USING (check_is_global_admin());
    DROP POLICY IF EXISTS "Global admins can delete office bearers" ON office_bearers;
    CREATE POLICY "Global admins can delete office bearers" ON office_bearers FOR DELETE USING (check_is_global_admin());
    
    DROP POLICY IF EXISTS "Society admins can manage office bearers" ON office_bearers;
    DROP POLICY IF EXISTS "Society admins can insert office bearers" ON office_bearers;
    CREATE POLICY "Society admins can insert office bearers" ON office_bearers FOR INSERT WITH CHECK (check_is_society_admin(society_id));
    DROP POLICY IF EXISTS "Society admins can update office bearers" ON office_bearers;
    CREATE POLICY "Society admins can update office bearers" ON office_bearers FOR UPDATE USING (check_is_society_admin(society_id));
    DROP POLICY IF EXISTS "Society admins can delete office bearers" ON office_bearers;
    CREATE POLICY "Society admins can delete office bearers" ON office_bearers FOR DELETE USING (check_is_society_admin(society_id));
    DROP POLICY IF EXISTS "Office bearers viewable by society members" ON office_bearers;
    CREATE POLICY "Office bearers viewable by society members" ON office_bearers FOR SELECT USING (check_is_society_member(society_id));


    -- 9. FUNCTIONS
    CREATE OR REPLACE FUNCTION increment_team_members(t_id UUID)
    RETURNS void AS $$
    BEGIN
        UPDATE teams SET members = COALESCE(members, 0) + 1 WHERE id = t_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE OR REPLACE FUNCTION decrement_team_members(t_id UUID)
    RETURNS void AS $$
    BEGIN
        UPDATE teams SET members = GREATEST(0, COALESCE(members, 0) - 1) WHERE id = t_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

