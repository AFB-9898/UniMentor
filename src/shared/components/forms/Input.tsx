import FormField from "./FormField";
import type { UseFormRegisterReturn } from "react-hook-form";

type InputProps = {
  label: string;
  error?: string;
  placeholder?: string;
  type?: "text" | "email" | "number" | "date";
  registration: UseFormRegisterReturn;
};

/**
 * Input — Reusable text input integrated with React Hook Form.
 *
 * Usage:
 *   <Input label="Name" registration={register("name")} error={errors.name?.message} />
 */
export default function Input({
  label,
  error,
  placeholder,
  type = "text",
  registration,
}: InputProps) {
  return (
    <FormField label={label} error={error}>
      <input
        {...registration}
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
          ${error ? "border-red-400" : "border-gray-300 dark:border-gray-600"}
        `}
      />
    </FormField>
  );
}
