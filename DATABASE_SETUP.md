# Database Setup Instructions

## Problem
The application was getting 500 errors because the Supabase database tables don't exist yet.

## Solution
You need to create the database tables in Supabase.

## Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://sjkkfciemgybjhwabepd.supabase.co
   - Login to your account

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Script**
   - Copy the entire content from `server/database-setup.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see three tables: `shops`, `bills`, `payments`

5. **Restart Your Application**
   - The errors should be resolved
   - You can now add shops, bills, and payments

## What the Script Does:
- Creates `shops` table with columns: id, shop_number, tenant_name, phone, rent
- Creates `bills` table with columns: id, shop_id, month, rent, electricity, water, other_charges, total
- Creates `payments` table with columns: id, bill_id, paid_amount, due_amount, payment_date
- Sets up foreign key relationships
- Creates indexes for better performance
