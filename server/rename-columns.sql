-- Rename columns in shops table (if they exist with camelCase)
ALTER TABLE shops RENAME COLUMN "shopNumber" TO shop_number;
ALTER TABLE shops RENAME COLUMN "tenantName" TO tenant_name;

-- Rename columns in bills table (if they exist with camelCase)
ALTER TABLE bills RENAME COLUMN "shopId" TO shop_id;
ALTER TABLE bills RENAME COLUMN "otherCharges" TO other_charges;

-- Rename columns in payments table (if they exist with camelCase)
ALTER TABLE payments RENAME COLUMN "billId" TO bill_id;
ALTER TABLE payments RENAME COLUMN "paidAmount" TO paid_amount;
ALTER TABLE payments RENAME COLUMN "dueAmount" TO due_amount;
ALTER TABLE payments RENAME COLUMN "paymentDate" TO payment_date;
