-- Migration: Add daily rent support
-- Date: 2026-03-17

-- 1. Update shops table to support rent type and daily rate
ALTER TABLE shops ADD COLUMN IF NOT EXISTS rent_type TEXT DEFAULT 'monthly' CHECK (rent_type IN ('monthly', 'daily'));
ALTER TABLE shops ADD COLUMN IF NOT EXISTS daily_rate NUMERIC DEFAULT 0 CHECK (daily_rate >= 0);

-- 2. Create daily_collections table
CREATE TABLE IF NOT EXISTS daily_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  collection_date DATE NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0 CHECK (amount >= 0),
  is_paid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure only one record per day per shop
  UNIQUE(shop_id, collection_date)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_collections_shop_id ON daily_collections(shop_id);
CREATE INDEX IF NOT EXISTS idx_daily_collections_date ON daily_collections(collection_date);
