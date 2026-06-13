/** Supabase `customers` table row (snake_case). */
export interface CustomerRow {
  id: string;
  owner_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  address: string;
  address_hint: string | null;
  lat: number | null;
  lng: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
