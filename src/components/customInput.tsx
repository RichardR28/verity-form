type CustomInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  description?: string;
};

export default function CustomInput({ label, description, ...props }: CustomInputProps) {
  return (
    <div>
      <p>{label}</p>
      <p>{description}</p>
      <input {...props} />
    </div>
  )
}