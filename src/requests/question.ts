import { Question } from '@/types/question';
import { urlFetch } from '@/utils/urlFetch';

/**
 * Fetches the next question
 */
type FetchNextQuestionParams = {
  questionId: Question['id'];
};

type FetchNextQuestionResponse =
  | { success: true; question: Question | null }
  | { success: false; error: string };

export async function fetchNextQuestion({
  questionId,
}: FetchNextQuestionParams): Promise<Question | null> {
  const data = await urlFetch<FetchNextQuestionResponse>('/questions/next', {
    method: 'POST',
    body: { questionId },
  });

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.question; // can be null if end of flow
}

/**
 * Fetches the first question
 */
type FetchFirstQuestionResponse =
  | { success: true; question: Question }
  | { success: false; error: string };

export async function fetchFirstQuestion(): Promise<Question | null> {
  const data = await urlFetch<FetchFirstQuestionResponse>('/questions/first');

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.question;
}
