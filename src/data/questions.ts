import { Questions } from '@/types/question';

export const questions: Questions = {
  q1: {
    id: 'q1',
    type: 'multiple_choice',
    multiple: false,
    title: 'Choose your favorite fruit',
    description: 'Only choose one.',
    options: ['Apple', 'Banana', 'Grapes', 'Orange'],
    prepopulate: 'Apple',
    nextQuestionId: 'q2',
  },
  q2: {
    id: 'q2',
    type: 'text',
    title: 'Why do you like these fruits?',
    description: 'Describe your reasons.',
    prepopulate: '',
    nextQuestionId: 'q3',
  },
  q3: {
    id: 'q3',
    type: 'multiple_choice',
    multiple: true,
    title: 'Choose your favorite fruits',
    description: 'You can select more than one.',
    options: ['Apple', 'Banana', 'Grapes', 'Orange'],
    prepopulate: ['Apple'],
    nextQuestionId: null,
  },
};
