-- 0003_wipe_and_reset_rls.sql
-- This script forcefully wipes ALL RLS policies across your core tables
-- and regenerates them cleanly from scratch. This guarantees that NO rogue,
-- old, or misnamed recursive policies will survive in your database.

BEGIN;

-- 1. WIPE ALL EXISTING POLICIES COMPLETELY
DO $$
DECLARE
    row record;
BEGIN
    FOR row IN 
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'profiles', 'societies', 'user_societies', 'teams', 
            'team_members', 'board_lists', 'board_cards', 'office_bearers'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', row.policyname, row.tablename);
    END LOOP;
END
$$;

-- 2. RE-ESTABLISH SAFE SECURITY DEFINER FUNCTIONS
CREATE OR REPLACE FUNCTION public.check_is_global_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_global_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.check_is_society_admin(s_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_societies 
    WHERE user_id = auth.uid() 
    AND society_id = s_id 
    AND role NOT IN ('Member', 'User', 'Pending', 'Guest')
    AND status = 'Active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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


-- 3. ENSURE RLS IS ENABLED
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_bearers ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_cards ENABLE ROW LEVEL SECURITY;


-- 4. CLEAN POLICIES RECREATION

-- PROFILES
CREATE POLICY "Profiles viewable by all authenticated users" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can edit their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Global admins can insert profiles" ON profiles FOR INSERT WITH CHECK (check_is_global_admin());
CREATE POLICY "Global admins can update profiles" ON profiles FOR UPDATE USING (check_is_global_admin());
CREATE POLICY "Global admins can delete profiles" ON profiles FOR DELETE USING (check_is_global_admin());

-- SOCIETIES
CREATE POLICY "Societies viewable by all" ON societies FOR SELECT USING (true);
CREATE POLICY "Global admins can insert societies" ON societies FOR INSERT WITH CHECK (check_is_global_admin());
CREATE POLICY "Global admins can update societies" ON societies FOR UPDATE USING (check_is_global_admin());
CREATE POLICY "Global admins can delete societies" ON societies FOR DELETE USING (check_is_global_admin());

-- USER SOCIETIES
CREATE POLICY "Authenticated users can view memberships" ON user_societies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can join a society" ON user_societies FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Global admins can insert memberships" ON user_societies FOR INSERT WITH CHECK (check_is_global_admin());
CREATE POLICY "Global admins can update memberships" ON user_societies FOR UPDATE USING (check_is_global_admin());
CREATE POLICY "Global admins can delete memberships" ON user_societies FOR DELETE USING (check_is_global_admin());
CREATE POLICY "Society admins insert memberships" ON user_societies FOR INSERT WITH CHECK (check_is_society_admin(society_id));
CREATE POLICY "Society admins update memberships" ON user_societies FOR UPDATE USING (check_is_society_admin(society_id));
CREATE POLICY "Society admins delete memberships" ON user_societies FOR DELETE USING (check_is_society_admin(society_id));

-- TEAMS
CREATE POLICY "Manage teams INSERT" ON teams FOR INSERT WITH CHECK (check_is_global_admin() OR check_is_society_admin(society_id));
CREATE POLICY "Manage teams UPDATE" ON teams FOR UPDATE USING (check_is_global_admin() OR check_is_society_admin(society_id));
CREATE POLICY "Manage teams DELETE" ON teams FOR DELETE USING (check_is_global_admin() OR check_is_society_admin(society_id));
CREATE POLICY "Teams viewable by society members" ON teams FOR SELECT USING (check_is_global_admin() OR check_is_society_member(society_id));

-- BOARD LISTS
CREATE POLICY "Manage lists INSERT" ON board_lists FOR INSERT WITH CHECK (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = board_lists.team_id)));
CREATE POLICY "Manage lists UPDATE" ON board_lists FOR UPDATE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = board_lists.team_id)));
CREATE POLICY "Manage lists DELETE" ON board_lists FOR DELETE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = board_lists.team_id)));
CREATE POLICY "Lists viewable by society members" ON board_lists FOR SELECT USING (check_is_global_admin() OR check_is_society_member((SELECT society_id FROM teams WHERE id = board_lists.team_id)));

-- BOARD CARDS
CREATE POLICY "Manage cards INSERT" ON board_cards FOR INSERT WITH CHECK (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = (SELECT team_id FROM board_lists WHERE id = board_cards.list_id))));
CREATE POLICY "Manage cards UPDATE" ON board_cards FOR UPDATE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = (SELECT team_id FROM board_lists WHERE id = board_cards.list_id))));
CREATE POLICY "Manage cards DELETE" ON board_cards FOR DELETE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = (SELECT team_id FROM board_lists WHERE id = board_cards.list_id))));
CREATE POLICY "Cards viewable by team members" ON board_cards FOR SELECT USING (check_is_global_admin() OR check_is_team_member((SELECT team_id FROM board_lists WHERE id = board_cards.list_id)));

-- TEAM MEMBERS
CREATE POLICY "Authenticated users can view team memberships" ON team_members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Manage team memberships INSERT" ON team_members FOR INSERT WITH CHECK (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = team_members.team_id)));
CREATE POLICY "Manage team memberships UPDATE" ON team_members FOR UPDATE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = team_members.team_id)));
CREATE POLICY "Manage team memberships DELETE" ON team_members FOR DELETE USING (check_is_global_admin() OR check_is_society_admin((SELECT society_id FROM teams WHERE id = team_members.team_id)));

-- OFFICE BEARERS
CREATE POLICY "Global admins can insert office bearers" ON office_bearers FOR INSERT WITH CHECK (check_is_global_admin());
CREATE POLICY "Global admins can update office bearers" ON office_bearers FOR UPDATE USING (check_is_global_admin());
CREATE POLICY "Global admins can delete office bearers" ON office_bearers FOR DELETE USING (check_is_global_admin());
CREATE POLICY "Society admins can insert office bearers" ON office_bearers FOR INSERT WITH CHECK (check_is_society_admin(society_id));
CREATE POLICY "Society admins can update office bearers" ON office_bearers FOR UPDATE USING (check_is_society_admin(society_id));
CREATE POLICY "Society admins can delete office bearers" ON office_bearers FOR DELETE USING (check_is_society_admin(society_id));
CREATE POLICY "Office bearers viewable by society members" ON office_bearers FOR SELECT USING (check_is_society_member(society_id));

COMMIT;
