type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'primary' | 'danger';
}

export default function Button({ label, variant, ...props }: ButtonType) {
  return (
    <>
      {variant === 'primary' || !variant ? (
        <button className="bg-[#0041fe] text-white px-4 py-2 rounded-[40px] hover:bg-blue-800 w-full transition-colors cursor-pointer" {...props}>{label}</button>
      ) : null}
      {variant === 'danger' && (
        <button className="bg-red-500 text-white px-4 py-2 rounded-[40px] hover:bg-red-700 w-full transition-colors cursor-pointer" {...props}>{label}</button>
      )}
    </>
  );
}