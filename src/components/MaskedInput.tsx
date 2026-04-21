import { PatternFormat } from "react-number-format"
import type { PatternFormatProps } from "react-number-format"
import type { FieldError, Merge, FieldErrorsImpl, Control, FieldValues, Path } from "react-hook-form"
import { Controller } from "react-hook-form"
import { CustomInput } from "@/components"

type MaskedInputProps<T extends FieldValues> = Omit<PatternFormatProps, "format" | "customInput"> & {
  format: string;
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  description?: string;
}

export default function MaskedInput<T extends FieldValues>({
  format,
  name,
  control,
  error,
  label,
  description,
  ...props
}: MaskedInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }) => (
        <PatternFormat
          {...field}
          {...props}
          format={format}
          customInput={CustomInput as any}
          onValueChange={(values) => onChange(values.value)}
          {...{ label, description, error } as any}
        />
      )}
    />
  )
}