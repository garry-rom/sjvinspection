import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Inspection = {
  id: string;
  user_id: string;
  engineer_name: string;
  vessel_name: string;
  location: string;
  inspection_date: string;
  vdr_make: 'NSR' | 'SALNAVIGATION' | 'NETWAVE' | 'HEADWAY';
  imo_number: string;
  mmsi_number: string;
  status: 'draft' | 'submitted' | 'reviewed';
  created_at: string;
  updated_at: string;
};
