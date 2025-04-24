import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { answer } = req.body;

  if (!answer || answer.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: 'Answer cannot be empty' });
  }

  if (!Array.isArray(answer) && answer.length < 5) {
    return res
      .status(400)
      .json({ success: false, error: 'Must be at least 5 characters long' });
  }

  if (Array.isArray(answer) && answer.length < 1) {
    return res
      .status(400)
      .json({ success: false, error: 'At least one option must be selected' });
  }

  return res.status(200).json({ success: true });
}
