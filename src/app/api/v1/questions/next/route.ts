import { NextResponse } from 'next/server';
import { questions } from '@/data/questions';

export async function POST(req: Request) {
  const { questionId } = await req.json();

  if (!questionId) {
    return NextResponse.json(
      { success: false, error: 'You must provide a questionId' },
      { status: 400 },
    );
  }

  const nextQuestion = questions[questionId as keyof typeof questions];
  console.log('Received:', { questionId, nextQuestion: nextQuestion });

  if (!nextQuestion) {
    return NextResponse.json({ success: true, question: null });
  }

  return NextResponse.json({
    success: true,
    question: nextQuestion ?? null,
  });
}
