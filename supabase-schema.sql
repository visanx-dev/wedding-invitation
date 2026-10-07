-- ================================================================
-- LUXURY WEDDING INVITATION PLATFORM - SUPABASE DATABASE SCHEMA
-- ================================================================
-- Paste this entire SQL into your Supabase Dashboard:
-- https://supabase.com/dashboard/project/_/sql/new
-- Click "Run" to initialize your database tables in 3 seconds!

-- 1. Create the RSVPs Table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id TEXT NOT NULL DEFAULT 'amal-nethmi',
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    guest_count INTEGER NOT NULL DEFAULT 1,
    attendance TEXT NOT NULL CHECK (attendance IN ('accept', 'decline')),
    events_attending TEXT NOT NULL DEFAULT 'both' CHECK (events_attending IN ('both', 'ceremony', 'reception', 'none')),
    meal_preference TEXT NOT NULL DEFAULT 'Vegetarian',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Index for fast lookups by wedding client
CREATE INDEX IF NOT EXISTS idx_rsvps_client_id ON public.rsvps(client_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 4. Create Policy: Allow anyone (guests) to submit an RSVP
DROP POLICY IF EXISTS "Allow public insert to rsvps" ON public.rsvps;
CREATE POLICY "Allow public insert to rsvps"
ON public.rsvps
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. Create Policy: Allow reading RSVPs for portal analytics
DROP POLICY IF EXISTS "Allow public read to rsvps" ON public.rsvps;
CREATE POLICY "Allow public read to rsvps"
ON public.rsvps
FOR SELECT
TO anon, authenticated
USING (true);

-- 6. Insert sample seed data
INSERT INTO public.rsvps (client_id, full_name, email, phone, guest_count, attendance, events_attending, meal_preference, notes)
VALUES
    ('amal-nethmi', 'Dr. & Mrs. Janaka Perera', 'janaka.perera@example.com', '+94 77 234 5678', 2, 'accept', 'both', 'Non-Vegetarian', 'Thrilled to celebrate with you both!'),
    ('amal-nethmi', 'Aravinda & Dinithi De Silva', 'aravinda@desilva.lk', '+94 71 889 2211', 2, 'accept', 'reception', 'Vegetarian', 'Counting down the days to the reception!'),
    ('amal-nethmi', 'Kavinda Wickramasinghe', 'kavinda.w@gmail.com', '+94 76 543 2190', 1, 'accept', 'ceremony', 'Non-Vegetarian', 'Honored to witness the sacred morning ceremony.'),
    ('amal-nethmi', 'Mr. Samantha Fernando', 'samantha.f@yahoo.com', '+94 77 999 8888', 1, 'decline', 'none', 'Non-Vegetarian', 'Sending warmest blessings from overseas!')
ON CONFLICT DO NOTHING;
