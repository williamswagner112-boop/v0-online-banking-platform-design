import { supabase } from './supabase-client';

export function generateReferenceNumber(): string {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`.slice(
    0,
    20
  );
}

export async function getAccountTransactions(
  accountId: string,
  limit: number = 50,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      success: true,
      transactions: data,
      total: count,
    };
  } catch (error) {
    console.error('Get transactions error:', error);
    throw error;
  }
}

export async function createTransaction(
  accountId: string,
  type: string,
  amount: number,
  description?: string
) {
  try {
    const referenceNumber = generateReferenceNumber();

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        account_id: accountId,
        transaction_type: type,
        amount,
        description: description || '',
        reference_number: referenceNumber,
        status: 'completed',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, transaction: data };
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
}

export async function getTransactionDetails(
  transactionId: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(
        `
        *,
        account_id (
          id,
          user_id
        )
      `
      )
      .eq('id', transactionId)
      .single();

    if (error) {
      throw error;
    }

    // Verify user owns the account
    if (data.account_id.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    return { success: true, transaction: data };
  } catch (error) {
    console.error('Get transaction error:', error);
    throw error;
  }
}
