import { Answer } from '@/types/answer';
import { Question } from '@/types/question';
import { urlFetch } from '@/utils/urlFetch';

/**
 * Submits the answer
 */
type SubmitAnswerParams = {
  questionId: Question['id'];
  answer: Answer;
};

type NextQuestionID = string | null; // null if form is complete
type SubmitAnswerResponse =
  | { success: true; nextQuestionId: NextQuestionID }
  | { success: false; error: string };

export async function submitAnswer({
  questionId,
  answer,
}: SubmitAnswerParams): Promise<NextQuestionID> {
  const data = await urlFetch<SubmitAnswerResponse>('/answers/submit', {
    method: 'POST',
    body: { questionId, answer },
  });

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.nextQuestionId;
}

/**
 * Validates the answer
 */

type ValidateAnswerResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function validateAnswer(
  questionId: Question['id'],
  answer: Answer,
): Promise<ValidateAnswerResponse> {
  const res = await urlFetch<ValidateAnswerResponse>('/answers/validate', {
    method: 'POST',
    body: { questionId, answer },
  });
  return res;
}
