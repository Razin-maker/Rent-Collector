-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_number TEXT NOT NULL UNIQUE,
  tenant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  rent NUMERIC NOT NULL CHECK (rent >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  rent NUMERIC NOT NULL CHECK (rent >= 0),
  electricity NUMERIC NOT NULL CHECK (electricity >= 0),
  water NUMERIC NOT NULL CHECK (water >= 0),
  other_charges NUMERIC DEFAULT 0 CHECK (other_charges >= 0),
  total NUMERIC NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  paid_amount NUMERIC NOT NULL CHECK (paid_amount >= 0),
  due_amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bills_shop_id ON bills(shop_id);
CREATE INDEX IF NOT EXISTS idx_bills_month ON bills(month);
CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
