import { forwardRef } from "react";
import FormField from "./FormField";
import type { UseFormRegisterReturn } from "react-hook-form";

type SelectProps = {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  registration: UseFormRegisterReturn;
};

/**
 * Select — Reusable select input integrated with React Hook Form.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder = "Seleccionar...", registration }, ref) => {
    return (
      <FormField label={label} error={error}>
        <select
          {...registration}
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-md text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
            ${error ? "border-red-400" : "border-gray-300"}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  },
);

Select.displayName = "Select";
export default Select;
