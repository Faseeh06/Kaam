-- 0004_join_code_migration_rpc.sql
-- Function to allow society admins to update society_code of all members at once.

CREATE OR REPLACE FUNCTION migrate_society_join_code(old_code TEXT, new_code TEXT)
RETURNS VOID AS $$
BEGIN
    -- Security Check:
    -- 1. Must be a Global Admin
    -- 2. OR Must be a Society Admin for the society that currently owns 'old_code'
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_global_admin = true
    ) OR EXISTS (
        SELECT 1 FROM public.user_societies us
        JOIN public.societies s ON us.society_id = s.id
        WHERE us.user_id = auth.uid() 
        AND s.join_code = old_code
        AND us.role IN ('Admin', 'Director', 'Deputy Director', 'HR', 'Society President', 'Vice President', 'Secretary', 'Treasurer', 'General Admin')
        AND us.status = 'Active'
    ) THEN
        -- Perform the migration
        UPDATE public.profiles
        SET society_code = new_code
        WHERE society_code = old_code;
    ELSE
        RAISE EXCEPTION 'Unauthorized: Only society admins for this organization can migrate join codes.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
