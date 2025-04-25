import { FormValues } from '@/types/form';
import { ControllerRenderProps } from 'react-hook-form';

interface QuestionInputProps {
  field: ControllerRenderProps<FormValues, 'answer'>;
}

export default function QuestionInput({ field }: QuestionInputProps) {
  return (
    <input
      type="text"
      {...field}
      className="w-full border-0 border-b-2 border-teal-300 focus:border-teal-500 hover:border-teal-400 focus:outline-none transition duration-200"
    />
  );
}
