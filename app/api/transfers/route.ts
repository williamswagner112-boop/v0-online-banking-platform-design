import { initiateTransfer, completeTransfer, getUserTransfers } from '@/lib/transfers';
import { supabase } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const transferSchema = z.object({
  fromAccountId: z.string().uuid(),
  toAccountId: z.string().uuid(),
  amount: z.number().positive(),
  purpose: z.string().optional(),
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

    const result = await getUserTransfers(userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch transfers' },
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
    const validated = transferSchema.parse(body);

    const result = await initiateTransfer(
      validated.fromAccountId,
      validated.toAccountId,
      validated.amount,
      userId,
      validated.purpose
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to initiate transfer',
      },
      { status: 400 }
    );
  }
}
