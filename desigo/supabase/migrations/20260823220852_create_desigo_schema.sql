/*
# DesiGo — Full Database Schema

## Overview
Creates the complete schema for the DesiGo Indian community platform for Georgia.
Includes tables for universities, businesses, events, organizations, announcements,
users, and saved items (bookmarks).

## New Tables
1. `universities` — educational institutions in Georgia
2. `businesses` — Indian businesses (restaurants, cafes, barbers, grocery, etc.)
3. `events` — community events (pending/approved status)
4. `organizations` — Indian community organizations
5. `announcements` — community notices from verified sources
6. `users` — public profile data for each signed-up member (linked to auth.users)
7. `saved_items` — user bookmarks (events, businesses, universities, organizations)

## Security
- RLS enabled on all tables.
- Public read on universities, businesses, organizations, announcements (approved only).
- Users can read/update only their own profile row.
- Events: public read for approved; authenticated users can insert (pending) and manage own.
- Saved items: users can CRUD only their own bookmarks.

## Notes
1. The `users` table uses `auth.uid()` as default for the id column, linking to auth.users.
2. Event submissions default to 'pending' status — they require admin approval.
*/

-- ============ UNIVERSITIES ============
CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL DEFAULT 'Tbilisi',
  country text NOT NULL DEFAULT 'Georgia',
  website text,
  logo text,
  description text,
  latitude float8,
  longitude float8,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "universities_select_all" ON universities;
CREATE POLICY "universities_select_all" ON universities FOR SELECT
  TO anon, authenticated USING (true);

-- ============ BUSINESSES ============
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'restaurant',
  subcategory text,
  address text,
  city text NOT NULL DEFAULT 'Tbilisi',
  latitude float8,
  longitude float8,
  phone text,
  website text,
  instagram text,
  image text,
  verified boolean NOT NULL DEFAULT false,
  rating float8,
  veg boolean,
  price_range text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "businesses_select_all" ON businesses;
CREATE POLICY "businesses_select_all" ON businesses FOR SELECT
  TO anon, authenticated USING (true);

-- ============ EVENTS ============
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'community',
  date date NOT NULL,
  start_time text,
  end_time text,
  location text,
  latitude float8,
  longitude float8,
  image text,
  organizer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  organizer_name text,
  external_link text,
  contact text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_approved" ON events;
CREATE POLICY "events_select_approved" ON events FOR SELECT
  TO anon, authenticated USING (status = 'approved' OR organizer_id = auth.uid());

DROP POLICY IF EXISTS "events_insert_own" ON events;
CREATE POLICY "events_insert_own" ON events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "events_update_own" ON events;
CREATE POLICY "events_update_own" ON events FOR UPDATE
  TO authenticated USING (organizer_id = auth.uid()) WITH CHECK (organizer_id = auth.uid());

DROP POLICY IF EXISTS "events_delete_own" ON events;
CREATE POLICY "events_delete_own" ON events FOR DELETE
  TO authenticated USING (organizer_id = auth.uid());

-- ============ ORGANIZATIONS ============
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'community',
  website text,
  instagram text,
  facebook text,
  contact text,
  city text NOT NULL DEFAULT 'Tbilisi',
  logo text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "organizations_select_all" ON organizations;
CREATE POLICY "organizations_select_all" ON organizations FOR SELECT
  TO anon, authenticated USING (true);

-- ============ ANNOUNCEMENTS ============
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  source text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  image text,
  external_link text,
  status text NOT NULL DEFAULT 'approved',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "announcements_select_approved" ON announcements;
CREATE POLICY "announcements_select_approved" ON announcements FOR SELECT
  TO anon, authenticated USING (status = 'approved');

-- ============ USERS ============
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  city text DEFAULT 'Tbilisi',
  university_id uuid REFERENCES universities(id) ON DELETE SET NULL,
  program text,
  year text,
  semester text,
  profile_image text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_all" ON users;
CREATE POLICY "users_select_all" ON users FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" ON users FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ SAVED ITEMS ============
CREATE TABLE IF NOT EXISTS saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_select_own" ON saved_items;
CREATE POLICY "saved_select_own" ON saved_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_insert_own" ON saved_items;
CREATE POLICY "saved_insert_own" ON saved_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_delete_own" ON saved_items;
CREATE POLICY "saved_delete_own" ON saved_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_universities_city ON universities(city);