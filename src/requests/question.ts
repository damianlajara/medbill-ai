import { Question } from '@/types/question';

type FetchNextQuestionParams = {
  questionId: string;
};

type FetchNextQuestionResponse =
  | { success: true; question: Question | null }
  | { success: false; error: string };

export async function fetchNextQuestion({
  questionId,
}: FetchNextQuestionParams): Promise<Question | null> {
  const res = await fetch('/api/question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questionId }),
  });

  const data: FetchNextQuestionResponse = await res.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.question; // can be null if end of flow
}
