type DialogProps = {
  children: React.ReactNode
}

export default function Dialog({ children }: DialogProps) {
  return (
    <section>
      {children}
    </section>
  )
}