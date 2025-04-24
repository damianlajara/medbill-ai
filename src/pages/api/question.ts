import { questions } from '@/data/questions';
import { NextApiRequest, NextApiResponse } from 'next';

// Fetch Next Question
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { questionId = null } = req.body;
  if (!questionId) {
    // can be empty string here
    // if no questionId or answer, return error
    return res.status(400).json({
      success: false,
      error: 'You must provide a questionId',
    });
  }

  const nextQuestion = questions[questionId as keyof typeof questions];
  console.log('Received:', { questionId, nextQuestion: nextQuestion });

  if (!nextQuestion) {
    return res.status(200).json({ success: true, question: null });
  }

  return res.status(200).json({ success: true, question: nextQuestion });
}
