import { questions } from '@/data/questions';
import { NextResponse } from 'next/server';

export async function GET() {
  const firstQuestion = Object.values(questions).at(0);

  if (!firstQuestion) {
    return NextResponse.json(
      { success: false, error: 'No questions available' },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true, question: firstQuestion });
}
