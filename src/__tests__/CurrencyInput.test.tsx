import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { useForm } from "react-hook-form"
import CurrencyInput from "@/components/CurrencyInput"

type FormValues = {
  salary: string
}

const CurrencyInputWrapper = ({
  defaultValue = "",
  error,
  description,
}: {
  defaultValue?: string
  error?: any
  description?: string
}) => {
  const { control } = useForm<FormValues>({
    defaultValues: { salary: defaultValue },
  })

  return (
    <CurrencyInput
      name="salary"
      control={control}
      label="Salário"
      error={error}
      description={description}
      prefix="R$ "
      decimalSeparator=","
      thousandSeparator="."
      decimalScale={2}
    />
  )
}

describe("CurrencyInput", () => {
  it("deve renderizar o componente com o label correto", () => {
    render(<CurrencyInputWrapper />)
    expect(screen.getByText("Salário")).toBeInTheDocument()
  })

  it("deve renderizar o input na tela", () => {
    render(<CurrencyInputWrapper />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("deve renderizar o input com valor vazio por padrão", () => {
    render(<CurrencyInputWrapper />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveDisplayValue("")
  })

  it("deve formatar o valor digitado com prefixo e separadores", async () => {
    render(<CurrencyInputWrapper />)
    const input = screen.getByRole("textbox")

    await act(async () => {
      fireEvent.change(input, { target: { value: "5000" } })
    })

    await waitFor(() => {
      expect(input).toHaveDisplayValue(/5\.000/)
    })
  })

  it("deve exibir o prefixo R$ após digitação", async () => {
    render(<CurrencyInputWrapper />)
    const input = screen.getByRole("textbox")

    await act(async () => {
      fireEvent.change(input, { target: { value: "100" } })
    })

    await waitFor(() => {
      expect(input).toHaveDisplayValue(/R\$/)
    })
  })

  it("deve formatar valor com separador de milhar", async () => {
    render(<CurrencyInputWrapper />)
    const input = screen.getByRole("textbox")

    await act(async () => {
      fireEvent.change(input, { target: { value: "2500" } })
    })

    await waitFor(() => {
      expect(input).toHaveDisplayValue(/2\.500/)
    })
  })

  it("deve renderizar a descrição quando informada", () => {
    render(<CurrencyInputWrapper description="Informe o salário bruto" />)
    expect(screen.getByText("Informe o salário bruto")).toBeInTheDocument()
  })

  it("não deve renderizar a descrição quando não informada", () => {
    render(<CurrencyInputWrapper />)
    expect(screen.queryByText("Informe o salário bruto")).not.toBeInTheDocument()
  })

  it("deve exibir mensagem de erro quando error é informado", () => {
    const error = { message: "Campo obrigatório", type: "required" }
    render(<CurrencyInputWrapper error={error} />)
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument()
  })

  it("não deve exibir mensagem de erro quando error não é informado", () => {
    render(<CurrencyInputWrapper />)
    expect(screen.queryByText("Campo obrigatório")).not.toBeInTheDocument()
  })

  it("deve ter inputmode numeric", () => {
    render(<CurrencyInputWrapper />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("inputmode", "numeric")
  })

  it("deve ter o name correto", () => {
    render(<CurrencyInputWrapper />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("name", "salary")
  })
})