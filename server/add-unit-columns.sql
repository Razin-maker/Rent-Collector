-- Add previous unit and current unit columns to bills table
ALTER TABLE bills ADD COLUMN IF NOT EXISTS prevunit NUMERIC;
ALTER TABLE bills ADD COLUMN IF NOT EXISTS currunit NUMERIC;
