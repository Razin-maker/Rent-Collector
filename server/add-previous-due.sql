-- Add previous_due column to bills table to support automated cascading dues
ALTER TABLE bills ADD COLUMN IF NOT EXISTS previous_due NUMERIC DEFAULT 0;

-- Update total calculation to include previous_due if you have existing bills
-- (This is optional as new bills will handle this via the API)
-- UPDATE bills SET total = rent + electricity + water + other_charges + previous_due;
