import { NumericFormat } from "react-number-format"
import type { NumericFormatProps } from "react-number-format"
import type { FieldError, Merge, FieldErrorsImpl, Control, FieldValues, Path } from "react-hook-form"
import { Controller } from "react-hook-form"
import { CustomInput } from "@/components"

type CurrencyInputProps<T extends FieldValues> = Omit<NumericFormatProps, "customInput"> & {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  description?: string;
}

export default function CurrencyInput<T extends FieldValues>({
  name,
  control,
  error,
  label,
  description,
  ...props
}: CurrencyInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }) => (
        <NumericFormat
          {...field}
          {...props}
          customInput={CustomInput as any}
          onValueChange={(values) => onChange(values.value ?? "")}
          {...{ label, description, error } as any}
        />
      )}
    />
  )
}