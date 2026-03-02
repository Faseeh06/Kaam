-- 0002_fix_rls_recursion.sql
-- This script permanently removes all old, recursive `FOR ALL` policies 
-- that were left behind in the database from previous migrations.

-- These old policies are what keeps triggering the 500 Infinite Recursion Error.
-- Running this file once in your Supabase SQL Editor will instantly cure the problem.

BEGIN;

-- 1. Drop ALL OLD profiles policies
DROP POLICY IF EXISTS "Global admins can manage profiles" ON profiles;

-- 2. Drop ALL OLD societies policies
DROP POLICY IF EXISTS "Global admins can manage societies" ON societies;

-- 3. Drop ALL OLD office bearers policies
DROP POLICY IF EXISTS "Global admins can manage office bearers" ON office_bearers;
DROP POLICY IF EXISTS "Society admins can manage office bearers" ON office_bearers;

-- 4. Drop ALL OLD user_societies (memberships) policies
DROP POLICY IF EXISTS "Society admins can manage their memberships" ON user_societies;
DROP POLICY IF EXISTS "Manage user societies" ON user_societies;
DROP POLICY IF EXISTS "Society admins can manage memberships" ON user_societies;

-- 5. Drop ALL OLD teams policies
DROP POLICY IF EXISTS "Manage teams" ON teams;

-- 6. Drop ALL OLD board_lists policies
DROP POLICY IF EXISTS "Manage lists" ON board_lists;

-- 7. Drop ALL OLD board_cards policies
DROP POLICY IF EXISTS "Manage cards" ON board_cards;

-- 8. Drop ALL OLD team_members policies
DROP POLICY IF EXISTS "Manage team memberships" ON team_members;

COMMIT;
