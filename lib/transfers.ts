import { supabase } from './supabase-client';
import { generateReferenceNumber } from './transactions';

export async function initiateTransfer(
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  userId: string,
  purpose?: string
) {
  try {
    // Verify user owns the from account
    const { data: fromAccount, error: accountError } = await supabase
      .from('bank_accounts')
      .select('user_id, balance')
      .eq('id', fromAccountId)
      .single();

    if (accountError || fromAccount.user_id !== userId) {
      throw new Error('Unauthorized: Account does not belong to user');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Create transfer record
    const { data, error } = await supabase
      .from('transfers')
      .insert({
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        amount,
        transfer_type: 'internal',
        status: 'pending',
        created_by: userId,
        purpose: purpose || 'Transfer',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, transfer: data };
  } catch (error) {
    console.error('Initiate transfer error:', error);
    throw error;
  }
}

export async function completeTransfer(
  transferId: string,
  userId: string
) {
  try {
    // Get transfer details
    const { data: transfer, error: transferError } = await supabase
      .from('transfers')
      .select('*')
      .eq('id', transferId)
      .eq('created_by', userId)
      .single();

    if (transferError || !transfer) {
      throw new Error('Transfer not found');
    }

    if (transfer.status !== 'pending') {
      throw new Error('Transfer cannot be completed in current status');
    }

    // Update from account balance
    const { data: fromAccount } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('id', transfer.from_account_id)
      .single();

    const newFromBalance =
      (fromAccount?.balance || 0) - transfer.amount;

    const { error: updateFromError } = await supabase
      .from('bank_accounts')
      .update({ balance: newFromBalance })
      .eq('id', transfer.from_account_id);

    if (updateFromError) throw updateFromError;

    // Update to account balance
    const { data: toAccount } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('id', transfer.to_account_id)
      .single();

    const newToBalance =
      (toAccount?.balance || 0) + transfer.amount;

    const { error: updateToError } = await supabase
      .from('bank_accounts')
      .update({ balance: newToBalance })
      .eq('id', transfer.to_account_id);

    if (updateToError) throw updateToError;

    // Update transfer status
    const { data: updatedTransfer, error: updateTransferError } = await supabase
      .from('transfers')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', transferId)
      .select()
      .single();

    if (updateTransferError) throw updateTransferError;

    return { success: true, transfer: updatedTransfer };
  } catch (error) {
    console.error('Complete transfer error:', error);
    throw error;
  }
}

export async function getUserTransfers(userId: string, limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { success: true, transfers: data };
  } catch (error) {
    console.error('Get transfers error:', error);
    throw error;
  }
}
