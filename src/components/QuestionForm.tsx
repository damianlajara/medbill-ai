'use client';

import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { Question } from '@/types/question';
import { fetchFirstQuestion, fetchNextQuestion } from '@/requests/question';
import { submitAnswer, validateAnswer } from '@/requests/answer';
import ThankYou from '@/components/ThankYou';
import FormActions from '@/components/FormActions';
import QuestionInput from '@/components/QuestionInput';
import QuestionMultipleChoice from '@/components/QuestionMultipleChoice';
import { FormValues } from '@/types/form';

export default function QuestionForm() {
  const [history, setHistory] = useState<
    { question: Question; answer: FormValues['answer'] }[]
  >([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [completed, setCompleted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      answer:
        current?.type === 'multiple_choice'
          ? current?.multiple // I hate inline ternaries like this but for sake of time will leave as-is with comments
            ? current?.prepopulate ?? [] // multi-select
            : current?.prepopulate ?? '' // single-select
          : current?.prepopulate ?? '', // normal text input
    },
  });

  const loadInitialQuestion = async () => {
    try {
      const first = await fetchFirstQuestion();
      if (first) {
        setCurrent(first);
        if (first.prepopulate) {
          setValue(
            'answer',
            first.type === 'multiple_choice' && first.multiple
              ? first.prepopulate ?? []
              : (first.prepopulate as string),
          );
        }
      }
    } catch (error) {
      console.error('Error fetching first question:', error);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!current) return;

    try {
      const result = await validateAnswer(current.id, data.answer);

      if (!result.success) {
        setError('answer', { type: 'manual', message: result.error });
        return;
      }

      const nextQuestionID = await submitAnswer({
        questionId: current.id,
        answer: data.answer,
      });

      if (!nextQuestionID) {
        // Form is complete
        setCompleted(true);
        return;
      }

      // Move on to the next question if validation is successful
      const next = await fetchNextQuestion({
        questionId: nextQuestionID,
      });

      setHistory((prev) => [
        ...prev,
        { question: current, answer: data.answer },
      ]);

      setCurrent(next);
      reset(); // reset form for the next question

      if (next?.prepopulate) {
        // prepopulate next answer if applicable
        setValue(
          'answer',
          next.type === 'multiple_choice' && next.multiple
            ? next.prepopulate ?? []
            : (next.prepopulate as string),
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('answer', {
        type: 'manual',
        message: 'An error occurred. Please try again.',
      });
    }
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = [...history];
    const last = prev.pop();
    setHistory(prev);
    setCurrent(last?.question || null);
    reset();

    // If we have an answer, use it. Otherwise, prepopulate the form
    if (last?.answer) {
      setValue('answer', last.answer);
    } else if (last?.question?.prepopulate) {
      const { question } = last;
      setValue(
        'answer',
        question.type === 'multiple_choice' && question.multiple
          ? question.prepopulate ?? []
          : (question.prepopulate as string),
      );
    }
  };

  if (!current) {
    return (
      <div
        className="cursor-pointer px-4 py-2 rounded-lg border 
              text-sm transition duration-200 text-teal-800 bg-white border-teal-300 hover:bg-teal-50"
      >
        <button onClick={loadInitialQuestion}>Start Form</button>
      </div>
    );
  }

  if (completed) {
    return <ThankYou />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 shadow-md rounded-xl p-12 bg-white"
    >
      <h2 className="text-xl font-semibold">{current.title}</h2>
      <p className="text-sm text-gray-600">{current.description}</p>

      {errors?.answer && (
        <p className="text-red-500">{errors.answer.message}</p>
      )}

      {current.type === 'text' && (
        <Controller
          name="answer"
          control={control}
          render={({ field }) => <QuestionInput field={field} />}
        />
      )}

      {current.type === 'multiple_choice' && (
        <Controller
          name="answer"
          control={control}
          render={({ field }) => (
            <QuestionMultipleChoice field={field} current={current} />
          )}
        />
      )}

      <FormActions goBack={goBack} isDisabled={history.length === 0} />
    </form>
  );
}
