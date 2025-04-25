import { Answer } from '@/types/answer';

export function validateAnswer(answer: Answer) {
  if (answer === undefined || answer === null)
    return { valid: false, error: 'Missing input' };
  if (Array.isArray(answer)) {
    // multiple choice
    if (answer.length < 1)
      return { valid: false, error: 'At least one option must be selected' };
    return { valid: true };
  } else {
    // text input or single choice (which is also text)
    if (answer.trim().length < 5)
      return { valid: false, error: 'Must be at least 5 characters long' };
    return { valid: true };
  }
}
