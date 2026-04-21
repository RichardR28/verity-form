import { forwardRef } from "react";
import type { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";

type CustomInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  description?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, description, error, type, onChange, value, ...props }, ref) => {
    return (
      <div className="flex flex-col overflow-hidden gap-1">
        <label htmlFor={label} className="text-[14px]" >{label}</label>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
        <input
          {...props}
          ref={ref}
          id={label}
          type={type}
          data-filled={String(!!value && value !== "")}
          className="w-full rounded-[4px] !text-[14px] pl-1 pr-1 h-8 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-200"
          onChange={(e) => {
            e.target.setAttribute("data-filled", String(!!e.target.value))
            onChange?.(e)
          }}
        />
        {error && <p className="text-red-400 !text-[12px] font-bold">{error.message as string}</p>}
      </div>
    )
  }
)

export default CustomInput