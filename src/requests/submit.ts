type SubmitQuestionParams = {
  questionId: string;
  answer: string | string[];
};

type NextQuestionID = string | null;
type SubmitQuestionResponse =
  | { success: true; nextQuestionId: NextQuestionID } // null if form is complete
  | { success: false; error: string };

export async function submitQuestion({
  questionId,
  answer,
}: SubmitQuestionParams): Promise<NextQuestionID> {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId,
      answer,
    }),
  });

  const data: SubmitQuestionResponse = await res.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.nextQuestionId;
}
