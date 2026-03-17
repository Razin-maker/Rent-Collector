-- Fix: Disable RLS on daily_collections table
-- OR add policies to allow all operations for authenticated users

-- Option 1: Simply disable RLS (simplest, like other tables in this project)
ALTER TABLE daily_collections DISABLE ROW LEVEL SECURITY;

-- Also ensure shops table RLS allows the new columns
-- (This is usually fine since shops already works)
