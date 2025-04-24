'use client';

import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { Question } from '@/types/question';
import { fetchNextQuestion } from '@/requests/question';
import { validateAnswer } from '@/requests/validate';
import { submitQuestion } from '@/requests/submit';

type FormValues = {
  answer: string | string[];
};

export default function QuestionForm() {
  const [history, setHistory] = useState<Question[]>([]);
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
    // TODO: Figure out a better way on how to load the first question
    const first = await fetchNextQuestion({ questionId: 'q1' });
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
  };

  const onSubmit = async (data: FormValues) => {
    if (!current) return;

    try {
      const result = await validateAnswer(current.id, data.answer);

      if (!result.success) {
        setError('answer', { type: 'manual', message: result.error });
        return;
      }

      const nextQuestionID = await submitQuestion({
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

      setHistory((prev) => [...prev, current]);
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
    setCurrent(last || null);
    reset();
    if (last?.prepopulate) {
      setValue(
        'answer',
        last.type === 'multiple_choice' && last.multiple
          ? last.prepopulate ?? []
          : (last.prepopulate as string),
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
    return (
      <div className="shadow-md rounded-xl p-12 bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold">Thank you!</h2>
        <p className="text-md text-gray-600">
          You have completed the questionnaire.
        </p>
      </div>
    );
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
          render={({ field }) => (
            <input
              type="text"
              {...field}
              className="w-full border-0 border-b-2 border-teal-300 focus:border-teal-500 hover:border-teal-400 focus:outline-none transition duration-200"
            />
          )}
        />
      )}

      {current.type === 'multiple_choice' && (
        <Controller
          name="answer"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-2">
              {current.options.map((option) => {
                const isMulti = current.multiple;
                const isChecked = isMulti
                  ? (field.value as string[])?.includes(option)
                  : field.value === option;

                return (
                  <label
                    key={option}
                    className={`cursor-pointer px-4 py-2 rounded-lg border 
              text-sm transition duration-200 text-teal-800
              ${
                isChecked
                  ? 'bg-teal-200 border-teal-500'
                  : 'bg-white border-teal-300 hover:bg-teal-50'
              }`}
                  >
                    <input
                      type={isMulti ? 'checkbox' : 'radio'}
                      name="answer"
                      value={option}
                      checked={isChecked}
                      onChange={(e) => {
                        if (isMulti) {
                          const newValue = [...(field.value || [])];
                          if (e.target.checked) {
                            newValue.push(option);
                          } else {
                            const index = newValue.indexOf(option);
                            if (index > -1) newValue.splice(index, 1);
                          }
                          field.onChange(newValue);
                        } else {
                          field.onChange(option);
                        }
                      }}
                      className="sr-only"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          )}
        />
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={goBack}
          disabled={history.length === 0}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </form>
  );
}
