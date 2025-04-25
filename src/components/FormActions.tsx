interface FormActionsProps {
  goBack: () => void;
  isDisabled: boolean;
}

export default function FormActions({ goBack, isDisabled }: FormActionsProps) {
  return (
    <div className="flex justify-between pt-4">
      <button
        type="button"
        onClick={goBack}
        disabled={isDisabled}
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
  );
}
