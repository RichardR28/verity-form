import { render, screen, fireEvent } from "@testing-library/react"
import { useForm } from "react-hook-form"
import MaskedInput from "@/components/MaskedInput"

type FormValues = {
  phone: string
  cpf: string
}

function TestForm({
  format,
  name,
  label,
  description,
  error,
  defaultValues,
}: {
  format: string
  name: keyof FormValues
  label: string
  description?: string
  error?: { message: string; type: string }
  defaultValues?: Partial<FormValues>
  onSubmit?: jest.Mock
}) {
  const { control } = useForm<FormValues>({ defaultValues })
  return (
    <MaskedInput
      format={format}
      name={name}
      control={control}
      label={label}
      description={description}
      error={error as any}
    />
  )
}

describe("MaskedInput", () => {
  it("deve renderizar o label corretamente", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    expect(screen.getByText("Telefone")).toBeInTheDocument()
  })

  it("deve renderizar o input na tela", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("deve associar o label ao input via htmlFor", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    const label = screen.getByText("Telefone")
    expect(label).toHaveAttribute("for", "Telefone")
  })

  it("deve renderizar a descrição quando informada", () => {
    render(
      <TestForm
        format="(##) #####-####"
        name="phone"
        label="Telefone"
        description="Informe seu telefone"
      />
    )
    expect(screen.getByText("Informe seu telefone")).toBeInTheDocument()
  })

  it("não deve renderizar a descrição quando não informada", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    expect(screen.queryByText("Informe seu telefone")).not.toBeInTheDocument()
  })

  it("deve exibir mensagem de erro quando error é informado", () => {
    const error = { message: "Campo obrigatório", type: "required" }
    render(
      <TestForm format="(##) #####-####" name="phone" label="Telefone" error={error} />
    )
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument()
  })

  it("não deve exibir mensagem de erro quando error não é informado", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    expect(screen.queryByText("Campo obrigatório")).not.toBeInTheDocument()
  })

  it("deve aplicar a máscara de telefone ao digitar", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "11987654321" } })
    expect(input).toHaveValue("(11) 98765-4321")
  })

  it("deve aplicar a máscara de CPF ao digitar", () => {
    render(<TestForm format="###.###.###-##" name="cpf" label="CPF" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "12345678901" } })
    expect(input).toHaveValue("123.456.789-01")
  })

  it("deve respeitar o limite de caracteres da máscara", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "119876543219999" } })
    expect(input).toHaveValue("(11) 98765-4321")
  })

  it("deve iniciar com o campo vazio por padrão", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveValue("")
  })

  it("deve formatar corretamente ao digitar valor completo", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "11987654321" } })
    expect(input).toHaveValue("(11) 98765-4321")
  })

  it("deve ter data-filled false quando o campo está vazio", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("data-filled", "false")
  })

  it("deve ter data-filled true ao digitar um valor", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "11987654321" } })
    expect(input).toHaveAttribute("data-filled", "true")
  })

  it("não deve aceitar letras no campo com máscara numérica", () => {
    render(<TestForm format="(##) #####-####" name="phone" label="Telefone" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "abcdefghijk" } })
    expect(input).toHaveValue("")
  })
})