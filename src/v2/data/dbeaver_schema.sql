-- ============================================================================
-- SRI RAMALAYAM TEMPLE ERP - CBEAVER / POSTGRESQL DATABASE SCHEMA
-- Execute this SQL file in DBeaver SQL Editor to initialize all tables
-- ============================================================================

-- 1. Devotees Table
CREATE TABLE IF NOT EXISTS devotees (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(255),
  registered_at VARCHAR(100)
);

-- 2. Donations & Hundi Table
CREATE TABLE IF NOT EXISTS donations (
  id VARCHAR(50) PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  date VARCHAR(50),
  seva VARCHAR(255),
  mode VARCHAR(100),
  city VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seva Bookings Table
CREATE TABLE IF NOT EXISTS seva_bookings (
  id VARCHAR(50) PRIMARY KEY,
  devotee_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  seva_name VARCHAR(255) NOT NULL,
  date VARCHAR(50),
  amount NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Confirmed'
);

-- 4. Construction Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  vendor VARCHAR(255),
  date VARCHAR(50),
  status VARCHAR(50),
  bill_no VARCHAR(100),
  notes TEXT
);

-- 5. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  timestamp VARCHAR(100),
  user_name VARCHAR(100),
  action TEXT
);

-- 6. Construction Materials Table
CREATE TABLE IF NOT EXISTS materials (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  qty VARCHAR(100),
  donor VARCHAR(255)
);

-- 7. Temple Volunteers Table
CREATE TABLE IF NOT EXISTS volunteers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  task VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Active'
);

-- 8. Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
  id VARCHAR(50) PRIMARY KEY,
  src TEXT NOT NULL,
  title VARCHAR(255),
  tag VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Enablement & Public Access Policy for Supabase
ALTER TABLE devotees ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seva_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on devotees" ON devotees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on donations" ON donations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on seva_bookings" ON seva_bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on materials" ON materials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on volunteers" ON volunteers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on gallery_images" ON gallery_images FOR ALL USING (true) WITH CHECK (true);
