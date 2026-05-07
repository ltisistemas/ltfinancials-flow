import { NextResponse } from 'next/server';
import { processFinancialInput } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = typeof body?.input === 'string' ? body.input.trim() : '';

    if (!input) {
      return NextResponse.json({ error: 'Input is required.' }, { status: 400 });
    }

    const transactions = await processFinancialInput(input);
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Failed to process financial input:', error);
    return NextResponse.json({ error: 'Failed to process financial input.' }, { status: 500 });
  }
}
