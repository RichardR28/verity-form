import { forwardRef, useState } from "react";
import type { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";

type SelectOption = {
  id: string | number;
  value: string;
}

type CustomSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  label: string;
  options: SelectOption[];
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  description?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ label, description, error, options, placeholder, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="flex flex-col overflow-hidden gap-1">
        <label htmlFor={label} className="text-[14px]">{label}</label>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
        <select
          {...props}
          ref={ref}
          data-filled="false"
          defaultValue=""
          className="w-full rounded-[4px] !text-[14px] pl-1 pr-1 h-8 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          style={{ color: isOpen ? "#4f4f4f" : undefined }}
          onChange={(e) => {
            e.target.setAttribute("data-filled", String(!!e.target.value))
            setIsOpen(false);
            onChange?.(e)
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 !text-[12px] font-bold">{error.message as string}</p>}
      </div>
    )
  }
);

export default CustomSelect
