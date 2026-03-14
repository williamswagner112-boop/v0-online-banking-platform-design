import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createTicketSchema = z.object({
  category: z.string().min(1),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  subject: z.string().min(5),
  description: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createTicketSchema.parse(body);

    // In a real app, this would save to the database
    const ticketNumber = `TKT${Date.now().toString().slice(-6)}`;

    return NextResponse.json(
      {
        success: true,
        ticket: {
          id: ticketNumber,
          ...validated,
          status: 'open',
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock data
    const tickets = [
      {
        id: 'TKT001',
        subject: 'Transfer not received',
        category: 'transaction_issue',
        status: 'resolved',
        priority: 'high',
      },
      {
        id: 'TKT002',
        subject: 'Cannot login to account',
        category: 'account_issue',
        status: 'in_progress',
        priority: 'urgent',
      },
    ];

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}
