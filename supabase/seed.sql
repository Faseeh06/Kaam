-- seed.sql
-- Mock data for local testing and initial environment setup.

-- 1. SEED SOCIETIES
INSERT INTO societies (id, name, acronym, members, status, description, email, website, whatsapp, accent_color, join_code)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Computer Science Society', 'CSS', 1200, 'Active', 'Empowering tech enthusiasts across campus.', 'contact@css.edu', 'https://css.example.com', 'https://wa.me/923001234567', 'bg-amber-600', 'CSS2026'),
('00000000-0000-0000-0000-000000000002', 'Entrepreneurs Network', 'EN', 450, 'Active', 'Building the next generation of founders.', 'en@uni.edu', NULL, 'https://wa.me/923007654321', 'bg-emerald-600', 'EN2026'),
('00000000-0000-0000-0000-000000000003', 'Robotics Club', 'RC', 320, 'Active', 'Engineering the future, one robot at a time.', 'rc@uni.edu', NULL, NULL, 'bg-blue-600', 'RC2026')
ON CONFLICT (id) DO UPDATE 
SET join_code = EXCLUDED.join_code;

-- 2. SEED TEAMS
INSERT INTO teams (id, society_id, name, members, leads, color, type)
VALUES
('11111111-1111-1111-1111-111111111111', '87654321-4321-4321-4321-210987654321', 'Creative & Design', 12, '{"Sarah J.", "Mike L."}', 'bg-fuchsia-500', 'Core'),
('22222222-2222-2222-2222-222222222222', '87654321-4321-4321-4321-210987654321', 'Operations & Logistics', 34, '{"Alex P."}', 'bg-blue-500', 'Core'),
('33333333-3333-3333-3333-333333333333', '87654321-4321-4321-4321-210987654321', 'Marketing & Outreach', 21, '{"Emma W.", "David K."}', 'bg-emerald-500', 'Core')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED BOARD LISTS
INSERT INTO board_lists (id, team_id, title, position)
VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'To Do', 0),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'In Progress', 1),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Done', 2)
ON CONFLICT (id) DO NOTHING;

-- NOTE: Profiles (users) require IDs that match auth.users (Supabase Auth). 
-- This seed file provides the structure; real user seeding usually happens 
-- via auth.users() functions in a local environment.
