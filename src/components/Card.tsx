type DialogProps = {
  children: React.ReactNode
}

export default function Card({ children }: DialogProps) {
  return (
    <section id="formCard" className="flex justify-center align-center flex-col gap-2 bg-white w-full max-w-[445px] rounded-[40px] p-8 shadow-md">
      {children}
    </section>
  )
}