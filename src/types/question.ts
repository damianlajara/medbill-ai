type QuestionBase = {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'multiple_choice';
  nextQuestionId?: string | null;
};

type TextQuestion = QuestionBase & {
  type: 'text';
  prepopulate?: string;
};

type MultipleChoiceQuestion = QuestionBase & {
  type: 'multiple_choice';
  multiple: boolean;
  options: string[];
  prepopulate?: string[] | string;
};

export type Question = TextQuestion | MultipleChoiceQuestion;

export type Questions = {
  [questionId: string]: Question;
};
