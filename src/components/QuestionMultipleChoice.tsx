import { FormValues } from '@/types/form';
import { Question } from '@/types/question';
import { ControllerRenderProps } from 'react-hook-form';

interface QuestionMultipleChoiceProps {
  field: ControllerRenderProps<FormValues, 'answer'>;
  current: Question;
}

export default function QuestionMultipleChoice({
  field,
  current,
}: QuestionMultipleChoiceProps) {
  if (current.type !== 'multiple_choice') {
    return null;
  }
  return (
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
  );
}
