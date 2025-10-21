/*
  # DOCSJV Inspection Management System - Database Schema

  ## 1. New Tables
    
    ### `profiles`
    - `id` (uuid, primary key, references auth.users)
    - `email` (text, unique)
    - `username` (text, unique)
    - `full_name` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
    
    ### `inspections`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `engineer_name` (text, required)
    - `vessel_name` (text, required)
    - `location` (text, required)
    - `inspection_date` (timestamptz, required)
    - `vdr_make` (text, required - NSR/SALNAVIGATION/NETWAVE/HEADWAY)
    - `imo_number` (text, required)
    - `mmsi_number` (text, required)
    - `status` (text, default 'draft' - draft/submitted/reviewed)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
    
    ### `dau_photos`
    - `id` (uuid, primary key)
    - `inspection_id` (uuid, references inspections)
    - `dau_door_open_url` (text, required)
    - `serial_number` (text, required)
    - `grounding_url` (text, required)
    - `battery_photo_url` (text, required)
    - `optional_photos` (jsonb, array of URLs)
    - `created_at` (timestamptz)
    
    ### `fixed_capsule`
    - `id` (uuid, primary key)
    - `inspection_id` (uuid, references inspections)
    - `capsule_photo_url` (text, required)
    - `cable_gland_url` (text, required)
    - `beacon_expiry_url` (text, required)
    - `optional_photos` (jsonb, array of URLs)
    - `created_at` (timestamptz)
    
    ### `float_free`
    - `id` (uuid, primary key)
    - `inspection_id` (uuid, references inspections)
    - `float_free_url` (text, required)
    - `cover_removed_url` (text, required)
    - `junction_box_url` (text, required)
    - `hru_url` (text, required)
    - `optional_photos` (jsonb, array of URLs)
    - `created_at` (timestamptz)
    
    ### `bcp_display`
    - `id` (uuid, primary key)
    - `inspection_id` (uuid, references inspections)
    - `display_photo_url` (text, required)
    - `optional_photos` (jsonb, array of URLs)
    - `created_at` (timestamptz)
    
    ### `video_interface`
    - `id` (uuid, primary key)
    - `inspection_id` (uuid, references inspections)
    - `unit1_url` (text, required)
    - `unit2_url` (text, required)
    - `optional_photos` (jsonb, array of URLs)
    - `created_at` (timestamptz)
    
    ### `reports`
    - `id` (uuid, primary key)
    - `inspection_id` (uuid, references inspections)
    - `epirb_report_url` (text, required)
    - `maker_report_url` (text, required)
    - `class_report_url` (text, nullable)
    - `class_name` (text, nullable)
    - `previous_coc_urls` (jsonb, array of URLs)
    - `created_at` (timestamptz)

  ## 2. Security
    - Enable RLS on all tables
    - Profiles: Users can read/update only their own profile
    - Inspections: Users can read/write only their own inspections
    - Related tables: Users can access data for their own inspections only

  ## 3. Indexes
    - Add indexes on foreign keys for performance
    - Add index on inspection status for filtering
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  engineer_name text NOT NULL,
  vessel_name text NOT NULL,
  location text NOT NULL,
  inspection_date timestamptz NOT NULL,
  vdr_make text NOT NULL CHECK (vdr_make IN ('NSR', 'SALNAVIGATION', 'NETWAVE', 'HEADWAY')),
  imo_number text NOT NULL,
  mmsi_number text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create DAU photos table
CREATE TABLE IF NOT EXISTS dau_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  dau_door_open_url text NOT NULL,
  serial_number text NOT NULL,
  grounding_url text NOT NULL,
  battery_photo_url text NOT NULL,
  optional_photos jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create fixed capsule table
CREATE TABLE IF NOT EXISTS fixed_capsule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  capsule_photo_url text NOT NULL,
  cable_gland_url text NOT NULL,
  beacon_expiry_url text NOT NULL,
  optional_photos jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create float free table
CREATE TABLE IF NOT EXISTS float_free (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  float_free_url text NOT NULL,
  cover_removed_url text NOT NULL,
  junction_box_url text NOT NULL,
  hru_url text NOT NULL,
  optional_photos jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create BCP display table
CREATE TABLE IF NOT EXISTS bcp_display (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  display_photo_url text NOT NULL,
  optional_photos jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create video interface table
CREATE TABLE IF NOT EXISTS video_interface (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  unit1_url text NOT NULL,
  unit2_url text NOT NULL,
  optional_photos jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  epirb_report_url text NOT NULL,
  maker_report_url text NOT NULL,
  class_report_url text,
  class_name text,
  previous_coc_urls jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inspections_user_id ON inspections(user_id);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);
CREATE INDEX IF NOT EXISTS idx_dau_photos_inspection_id ON dau_photos(inspection_id);
CREATE INDEX IF NOT EXISTS idx_fixed_capsule_inspection_id ON fixed_capsule(inspection_id);
CREATE INDEX IF NOT EXISTS idx_float_free_inspection_id ON float_free(inspection_id);
CREATE INDEX IF NOT EXISTS idx_bcp_display_inspection_id ON bcp_display(inspection_id);
CREATE INDEX IF NOT EXISTS idx_video_interface_inspection_id ON video_interface(inspection_id);
CREATE INDEX IF NOT EXISTS idx_reports_inspection_id ON reports(inspection_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE dau_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_capsule ENABLE ROW LEVEL SECURITY;
ALTER TABLE float_free ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcp_display ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_interface ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Inspections policies
CREATE POLICY "Users can view own inspections"
  ON inspections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inspections"
  ON inspections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inspections"
  ON inspections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inspections"
  ON inspections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- DAU photos policies
CREATE POLICY "Users can view dau photos for own inspections"
  ON dau_photos FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = dau_photos.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert dau photos for own inspections"
  ON dau_photos FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = dau_photos.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can update dau photos for own inspections"
  ON dau_photos FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = dau_photos.inspection_id
    AND inspections.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = dau_photos.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete dau photos for own inspections"
  ON dau_photos FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = dau_photos.inspection_id
    AND inspections.user_id = auth.uid()
  ));

-- Fixed capsule policies
CREATE POLICY "Users can view fixed capsule for own inspections"
  ON fixed_capsule FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = fixed_capsule.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert fixed capsule for own inspections"
  ON fixed_capsule FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = fixed_capsule.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can update fixed capsule for own inspections"
  ON fixed_capsule FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = fixed_capsule.inspection_id
    AND inspections.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = fixed_capsule.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete fixed capsule for own inspections"
  ON fixed_capsule FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = fixed_capsule.inspection_id
    AND inspections.user_id = auth.uid()
  ));

-- Float free policies
CREATE POLICY "Users can view float free for own inspections"
  ON float_free FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = float_free.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert float free for own inspections"
  ON float_free FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = float_free.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can update float free for own inspections"
  ON float_free FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = float_free.inspection_id
    AND inspections.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = float_free.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete float free for own inspections"
  ON float_free FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = float_free.inspection_id
    AND inspections.user_id = auth.uid()
  ));

-- BCP display policies
CREATE POLICY "Users can view bcp display for own inspections"
  ON bcp_display FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = bcp_display.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert bcp display for own inspections"
  ON bcp_display FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = bcp_display.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can update bcp display for own inspections"
  ON bcp_display FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = bcp_display.inspection_id
    AND inspections.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = bcp_display.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete bcp display for own inspections"
  ON bcp_display FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = bcp_display.inspection_id
    AND inspections.user_id = auth.uid()
  ));

-- Video interface policies
CREATE POLICY "Users can view video interface for own inspections"
  ON video_interface FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = video_interface.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert video interface for own inspections"
  ON video_interface FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = video_interface.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can update video interface for own inspections"
  ON video_interface FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = video_interface.inspection_id
    AND inspections.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = video_interface.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete video interface for own inspections"
  ON video_interface FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = video_interface.inspection_id
    AND inspections.user_id = auth.uid()
  ));

-- Reports policies
CREATE POLICY "Users can view reports for own inspections"
  ON reports FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = reports.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert reports for own inspections"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = reports.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can update reports for own inspections"
  ON reports FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = reports.inspection_id
    AND inspections.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = reports.inspection_id
    AND inspections.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete reports for own inspections"
  ON reports FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = reports.inspection_id
    AND inspections.user_id = auth.uid()
  ));