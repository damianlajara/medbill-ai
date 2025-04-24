import { questions } from '@/data/questions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { questionId, answer } = req.body;

  if (!questionId || answer == null || answer === '') {
    return res.status(400).json({
      success: false,
      error: 'You must provide a questionId and answer',
    });
  }

  // TODO: We already validate the answer in the frontend. However can we really trust the frontend?
  // We should probably also validate that the answer is correct before hitting this API
  // For now, I will just check if the answer is not empty
  const isValid = Array.isArray(answer)
    ? answer.length > 0
    : typeof answer === 'string' && answer.trim().length > 0;

  if (!isValid) {
    return res
      .status(200)
      .json({ success: false, error: 'Answer is required' });
  }

  const current = questions[questionId];
  if (!current) {
    return res.status(404).json({
      success: false,
      error: 'Question not found',
    });
  }

  return res
    .status(200)
    .json({ success: true, nextQuestionId: current.nextQuestionId || null });
}
