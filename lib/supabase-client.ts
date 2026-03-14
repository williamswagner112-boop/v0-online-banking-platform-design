import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone_number: string | null;
          kyc_status: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone_number?: string;
          password_hash: string;
        };
        Update: {
          full_name?: string;
          phone_number?: string;
          kyc_status?: string;
        };
      };
      bank_accounts: {
        Row: {
          id: string;
          user_id: string;
          account_number: string;
          account_type: string;
          balance: number;
          account_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          account_number: string;
          account_type: string;
        };
        Update: {
          account_status?: string;
          balance?: number;
        };
      };
      transactions: {
        Row: {
          id: string;
          account_id: string;
          transaction_type: string;
          amount: number;
          status: string;
          created_at: string;
          completed_at: string | null;
        };
      };
      transfers: {
        Row: {
          id: string;
          from_account_id: string;
          to_account_id: string;
          amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          from_account_id: string;
          to_account_id: string;
          amount: number;
          transfer_type: string;
          created_by: string;
        };
      };
    };
  };
};
