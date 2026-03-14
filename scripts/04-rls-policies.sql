-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::uuid = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::uuid = id);

-- Accounts RLS Policies
DROP POLICY IF EXISTS "Users can view own accounts" ON bank_accounts;
CREATE POLICY "Users can view own accounts" ON bank_accounts
  FOR SELECT USING (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Users can create own accounts" ON bank_accounts;
CREATE POLICY "Users can create own accounts" ON bank_accounts
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Users can update own accounts" ON bank_accounts;
CREATE POLICY "Users can update own accounts" ON bank_accounts
  FOR UPDATE USING (user_id = auth.uid()::uuid);

-- Transactions RLS Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    account_id IN (
      SELECT id FROM bank_accounts WHERE user_id = auth.uid()::uuid
    )
  );

-- Transfers RLS Policies
DROP POLICY IF EXISTS "Users can view own transfers" ON transfers;
CREATE POLICY "Users can view own transfers" ON transfers
  FOR SELECT USING (
    created_by = auth.uid()::uuid OR
    from_account_id IN (SELECT id FROM bank_accounts WHERE user_id = auth.uid()::uuid)
  );

DROP POLICY IF EXISTS "Users can create own transfers" ON transfers;
CREATE POLICY "Users can create own transfers" ON transfers
  FOR INSERT WITH CHECK (created_by = auth.uid()::uuid);

-- Beneficiaries RLS Policies
DROP POLICY IF EXISTS "Users can view own beneficiaries" ON beneficiaries;
CREATE POLICY "Users can view own beneficiaries" ON beneficiaries
  FOR SELECT USING (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Users can create own beneficiaries" ON beneficiaries;
CREATE POLICY "Users can create own beneficiaries" ON beneficiaries
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

-- MFA Verifications RLS Policies
DROP POLICY IF EXISTS "Users can view own mfa" ON mfa_verifications;
CREATE POLICY "Users can view own mfa" ON mfa_verifications
  FOR SELECT USING (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Users can create own mfa" ON mfa_verifications;
CREATE POLICY "Users can create own mfa" ON mfa_verifications
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

-- Support Tickets RLS Policies
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Users can create own tickets" ON support_tickets;
CREATE POLICY "Users can create own tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

-- Audit Logs RLS Policies (system only)
DROP POLICY IF EXISTS "Users can view own audit logs" ON audit_logs;
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid()::uuid OR user_id IS NULL);
