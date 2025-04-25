import { questions } from '@/data/questions';
import { validateAnswer } from '@/lib/validate';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { questionId, answer } = await req.json();

  if (!questionId || answer == null || answer === '') {
    return NextResponse.json(
      { success: false, error: 'You must provide a questionId and answer' },
      { status: 400 },
    );
  }

  // Note: We already validate the answer in the frontend. However can we really trust the frontend?
  // We should probably also validate that the answer is correct before hitting this API
  const res = validateAnswer(answer);
  const isValid = res.valid;
  if (!isValid) {
    return NextResponse.json(
      { success: false, error: res.error },
      { status: 400 },
    );
  }

  const current = questions[questionId];
  if (!current) {
    return NextResponse.json(
      { success: false, error: 'Question not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    nextQuestionId: current.nextQuestionId || null,
  });
}
