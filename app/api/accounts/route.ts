import { createBankAccount, getUserAccounts } from '@/lib/accounts';
import { supabase } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createAccountSchema = z.object({
  accountType: z.enum(['checking', 'savings', 'money_market']),
  isPrimary: z.boolean().optional(),
});

async function getUserId(request: NextRequest): Promise<string | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await getUserAccounts(userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = createAccountSchema.parse(body);

    const result = await createBankAccount(
      userId,
      validated.accountType,
      validated.isPrimary
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create account',
      },
      { status: 400 }
    );
  }
}
