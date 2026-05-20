import { forwardRef } from "react";
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
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, placeholder, type = "text", registration }, ref) => {
    return (
      <FormField label={label} error={error}>
        <input
          {...registration}
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 border rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
            ${error ? "border-red-400" : "border-gray-300"}
          `}
        />
      </FormField>
    );
  },
);

Input.displayName = "Input";
export default Input;
