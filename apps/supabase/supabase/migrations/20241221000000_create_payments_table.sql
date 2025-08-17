-- Create payments table for tracking ad space purchases
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  polar_checkout_id TEXT UNIQUE,
  customer_email TEXT NOT NULL,
  amount BIGINT NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'USD',
  product_id TEXT,
  product_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_customer_email ON public.payments(customer_email);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read their own payments (optional)
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT
  USING (auth.jwt() ->> 'email' = customer_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
