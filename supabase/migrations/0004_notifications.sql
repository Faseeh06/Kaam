-- 0004_notifications.sql

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'assignment',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies

-- Users can view their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications 
FOR SELECT USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications 
FOR UPDATE USING (auth.uid() = user_id);

-- Anyone authenticated can insert notifications (e.g., when assigning a task to someone else)
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON notifications;
CREATE POLICY "Authenticated users can insert notifications" ON notifications 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
