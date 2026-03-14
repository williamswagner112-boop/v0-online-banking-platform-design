import { supabase } from './supabase-client';

// Generate unique account number
export function generateAccountNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString().slice(2, 6);
  return `ACC${timestamp}${random}`;
}

export async function createBankAccount(
  userId: string,
  accountType: string,
  isPrimary: boolean = false
) {
  try {
    const accountNumber = generateAccountNumber();

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert({
        user_id: userId,
        account_number: accountNumber,
        account_type: accountType,
        account_status: 'active',
        is_primary: isPrimary,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, account: data };
  } catch (error) {
    console.error('Create account error:', error);
    throw error;
  }
}

export async function getUserAccounts(userId: string) {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('account_status', 'active')
      .order('is_primary', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, accounts: data };
  } catch (error) {
    console.error('Get accounts error:', error);
    throw error;
  }
}

export async function getAccountDetails(accountId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, account: data };
  } catch (error) {
    console.error('Get account error:', error);
    throw error;
  }
}

export async function getAccountBalance(accountId: string) {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('id', accountId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, balance: data?.balance || 0 };
  } catch (error) {
    console.error('Get balance error:', error);
    throw error;
  }
}
