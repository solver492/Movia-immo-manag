
/*
  # Movia Immo - Create Properties Table

  ## Summary
  Creates the main `properties` table for managing real estate listings at Movia Immo agency (Morocco).

  ## New Tables

  ### `properties`
  - `id` (uuid, primary key) - Internal unique identifier
  - `id_bien` (text, unique) - Human-readable ID in MOV-XXX format, auto-generated
  - `type` (text) - Property type: Appartement, Maison, Villa, Terrain, Local Commercial
  - `transaction` (text) - Transaction type: À vendre, À louer
  - `prix` (numeric) - Price in MAD (Moroccan Dirham)
  - `superficie` (numeric) - Surface area in m²
  - `nb_chambres` (integer, optional) - Number of bedrooms
  - `parking` (boolean) - Parking available
  - `etage` (integer, optional) - Floor number
  - `ascenseur` (boolean) - Elevator available
  - `etat` (text, optional) - Property condition: Aménagé, Brut, En travaux
  - `localisation` (text) - City/Region in Morocco
  - `contact_nom` (text) - Owner/client full name
  - `contact_telephone` (text) - Owner/client phone number
  - `statut_mandat` (text) - Mandate status: Actif, Vendu, Loué, En attente
  - `photo_url` (text, optional) - URL to property photo
  - `created_at` (timestamptz) - Record creation timestamp

  ## Auto ID Generation
  - A PostgreSQL sequence (`property_id_seq`) and function (`generate_property_id`) are created
    to auto-generate IDs in the MOV-001, MOV-002, ... format

  ## Security
  - RLS is enabled on the `properties` table
  - Policies allow anon access for this internal management tool
    (authentication can be added later as a future enhancement)
*/

CREATE SEQUENCE IF NOT EXISTS property_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_property_id()
RETURNS text AS $$
DECLARE
  next_val integer;
BEGIN
  next_val := nextval('property_id_seq');
  RETURN 'MOV-' || LPAD(next_val::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_bien text UNIQUE NOT NULL DEFAULT generate_property_id(),
  type text NOT NULL,
  transaction text NOT NULL,
  prix numeric NOT NULL DEFAULT 0,
  superficie numeric NOT NULL DEFAULT 0,
  nb_chambres integer,
  parking boolean DEFAULT false,
  etage integer,
  ascenseur boolean DEFAULT false,
  etat text,
  localisation text NOT NULL DEFAULT '',
  contact_nom text NOT NULL DEFAULT '',
  contact_telephone text NOT NULL DEFAULT '',
  statut_mandat text NOT NULL DEFAULT 'Actif',
  photo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal tool anon select"
  ON properties FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Internal tool anon insert"
  ON properties FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Internal tool anon update"
  ON properties FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Internal tool anon delete"
  ON properties FOR DELETE
  TO anon
  USING (true);
