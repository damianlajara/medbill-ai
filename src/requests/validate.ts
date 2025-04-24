type ValidateAnswerResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function validateAnswer(
  questionId: string,
  answer: string | string[],
): Promise<ValidateAnswerResponse> {
  const res = await fetch('/api/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questionId,
      answer,
    }),
  });
  const data: ValidateAnswerResponse = await res.json();
  return data;
}
