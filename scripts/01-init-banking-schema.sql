-- Online Banking Platform Database Schema
-- Phase 1: Core Tables & Security Infrastructure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  ssn_last4 VARCHAR(4),
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_verified_email BOOLEAN DEFAULT false,
  is_verified_phone BOOLEAN DEFAULT false,
  kyc_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  kyc_submission_date TIMESTAMP,
  kyc_approval_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

-- Bank Accounts Table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_type VARCHAR(50) NOT NULL, -- checking, savings, money_market
  account_status VARCHAR(20) DEFAULT 'active', -- active, frozen, closed
  balance DECIMAL(15, 2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  interest_rate DECIMAL(5, 4) DEFAULT 0,
  account_opening_date DATE NOT NULL DEFAULT CURRENT_DATE,
  account_closing_date DATE,
  overdraft_limit DECIMAL(15, 2) DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT positive_balance CHECK (balance >= -overdraft_limit)
);

-- Beneficiaries Table (for transfers)
CREATE TABLE IF NOT EXISTS beneficiaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  beneficiary_name VARCHAR(255) NOT NULL,
  beneficiary_account_number VARCHAR(20) NOT NULL,
  beneficiary_routing_number VARCHAR(20),
  beneficiary_bank_name VARCHAR(255),
  relationship VARCHAR(50), -- friend, family, business, etc
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- transfer_out, transfer_in, deposit, withdrawal, fee
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description VARCHAR(500),
  merchant_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, reversed
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  failed_reason VARCHAR(500),
  CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Transfers Table (Inter-account transfers)
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  to_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  transfer_type VARCHAR(50) NOT NULL, -- internal, external
  purpose VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, completed, failed, cancelled
  approval_required BOOLEAN DEFAULT false,
  approval_status VARCHAR(20), -- pending, approved, rejected
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP,
  scheduled_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(50), -- daily, weekly, monthly, yearly
  recurrence_end_date DATE,
  encryption_key_version INT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  failed_reason VARCHAR(500),
  CONSTRAINT positive_transfer CHECK (amount > 0),
  CONSTRAINT different_accounts CHECK (from_account_id != to_account_id)
);

-- MFA Verification Table
CREATE TABLE IF NOT EXISTS mfa_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mfa_type VARCHAR(50) NOT NULL, -- totp, sms, email
  mfa_secret VARCHAR(255),
  phone_number_encrypted VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  last_verified_at TIMESTAMP,
  backup_codes TEXT[], -- Array of backup codes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50), -- account_issue, transaction_issue, security, feature_request, other
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  status VARCHAR(20) DEFAULT 'open', -- open, in_progress, waiting_customer, resolved, closed
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50), -- user, account, transaction, transfer, etc
  resource_id VARCHAR(100),
  details JSONB,
  ip_address INET,
  user_agent VARCHAR(500),
  status VARCHAR(20), -- success, failure
  error_message VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session Table for NextAuth
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verification Tokens Table
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  token_type VARCHAR(50) NOT NULL, -- email_verification, password_reset, mfa_verification
  expires TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_accounts_status ON bank_accounts(account_status);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transfers_from_account ON transfers(from_account_id);
CREATE INDEX idx_transfers_to_account ON transfers(to_account_id);
CREATE INDEX idx_transfers_status ON transfers(status);
CREATE INDEX idx_transfers_created_at ON transfers(created_at);
CREATE INDEX idx_beneficiaries_user_id ON beneficiaries(user_id);
CREATE INDEX idx_mfa_user_id ON mfa_verifications(user_id);
CREATE INDEX idx_support_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_status ON support_tickets(status);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_verification_tokens_user_id ON verification_tokens(user_id);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only view their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::uuid = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::uuid = id);

-- RLS Policies - Accounts
CREATE POLICY "Users can view own accounts" ON bank_accounts
  FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create own accounts" ON bank_accounts
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update own accounts" ON bank_accounts
  FOR UPDATE USING (user_id = auth.uid()::uuid);

-- RLS Policies - Transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    account_id IN (
      SELECT id FROM bank_accounts WHERE user_id = auth.uid()::uuid
    )
  );

-- RLS Policies - Transfers
CREATE POLICY "Users can view own transfers" ON transfers
  FOR SELECT USING (
    created_by = auth.uid()::uuid OR
    from_account_id IN (SELECT id FROM bank_accounts WHERE user_id = auth.uid()::uuid)
  );

-- RLS Policies - Support Tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create own tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

-- Create Update Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON bank_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mfa_updated_at BEFORE UPDATE ON mfa_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit Logging Trigger
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    status
  ) VALUES (
    auth.uid(),
    TG_ARGV[0],
    TG_TABLE_NAME,
    NEW.id::text,
    row_to_json(NEW),
    'success'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to key tables
CREATE TRIGGER audit_transfers AFTER INSERT ON transfers
  FOR EACH ROW EXECUTE FUNCTION audit_trigger('transfer_created');

CREATE TRIGGER audit_accounts AFTER INSERT ON bank_accounts
  FOR EACH ROW EXECUTE FUNCTION audit_trigger('account_created');

COMMIT;
