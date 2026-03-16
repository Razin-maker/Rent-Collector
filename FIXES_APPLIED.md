# Fixes Applied to Rent Manager

## Issue
The application was throwing 500 Internal Server Errors on all API endpoints.

## Root Cause
1. **Database tables don't exist** - Supabase database was empty
2. **Column name mismatch** - Code used camelCase (shopNumber) but PostgreSQL uses snake_case (shop_number)

## Changes Made

### Backend (Server) - Updated all routes to use snake_case:

#### `server/routes/shopRoutes.js`
- Changed `shopNumber` → `shop_number`
- Changed `tenantName` → `tenant_name`

#### `server/routes/billRoutes.js`
- Changed `shopId` → `shop_id`
- Changed `otherCharges` → `other_charges`
- Changed foreign key reference from `bills_shopId_fkey` → `bills_shop_id_fkey`

#### `server/routes/paymentRoutes.js`
- Changed `billId` → `bill_id`
- Changed `paidAmount` → `paid_amount`
- Changed `dueAmount` → `due_amount`
- Changed `paymentDate` → `payment_date`
- Changed foreign key references to snake_case

### Frontend (Client) - Updated all pages to read snake_case from API:

#### `client/src/pages/Dashboard.jsx`
- Updated to read `paid_amount`, `due_amount`
- Fixed chart data to use `payment.bills.month` instead of `payment.billId.month`
- Updated table to use `shop_number`, `tenant_name`

#### `client/src/pages/Shops.jsx`
- Updated table display to use `shop_number`, `tenant_name`
- Updated edit handler to map snake_case to camelCase for form

#### `client/src/pages/Bills.jsx`
- Updated table to use `shop_number`, `tenant_name`, `other_charges`
- Updated edit handler to map `shop_id`, `other_charges`
- Updated dropdown to display `shop_number`, `tenant_name`

#### `client/src/pages/Payments.jsx`
- Updated table to use `payment_date`, `paid_amount`, `due_amount`, `shop_number`, `tenant_name`
- Updated edit handler to map `bill_id`, `paid_amount`, `payment_date`
- Updated dropdown to display `shop_number`, `tenant_name`

#### `client/src/pages/Reports.jsx`
- Updated all filters to use `shop_id`, `due_amount`
- Updated calculations to use `paid_amount`, `due_amount`
- Updated all tables to use snake_case fields

### Database Setup

#### `server/database-setup.sql` (Created)
SQL script to create all necessary tables with proper schema:
- `shops` table
- `bills` table with foreign key to shops
- `payments` table with foreign key to bills
- Indexes for performance

## Next Steps

**You must run the SQL script in Supabase to create the tables:**

1. Open Supabase Dashboard: https://sjkkfciemgybjhwabepd.supabase.co
2. Go to SQL Editor
3. Copy content from `server/database-setup.sql`
4. Run the script
5. Refresh your application

After running the SQL script, all 500 errors will be resolved and the application will work correctly.
