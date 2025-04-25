import { validateAnswer } from '@/lib/validate';
import { Answer } from '@/types/answer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { answer } = (await req.json()) as { answer: Answer };

  const validationResult = validateAnswer(answer);

  if (!validationResult.valid) {
    return NextResponse.json(
      { success: false, error: validationResult.error },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
