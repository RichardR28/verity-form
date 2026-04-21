import { render, screen, fireEvent } from "@testing-library/react"
import CustomInput from "@/components/CustomInput"

describe("CustomInput", () => {
  it("deve renderizar o label corretamente", () => {
    render(<CustomInput label="Nome" />)
    expect(screen.getByText("Nome")).toBeInTheDocument()
  })

  it("deve renderizar o input na tela", () => {
    render(<CustomInput label="Nome" />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("deve associar o label ao input via htmlFor", () => {
    render(<CustomInput label="Nome" />)
    const label = screen.getByText("Nome")
    expect(label).toHaveAttribute("for", "Nome")
  })

  it("deve renderizar a descrição quando informada", () => {
    render(<CustomInput label="Nome" description="Informe seu nome completo" />)
    expect(screen.getByText("Informe seu nome completo")).toBeInTheDocument()
  })

  it("não deve renderizar a descrição quando não informada", () => {
    render(<CustomInput label="Nome" />)
    expect(screen.queryByText("Informe seu nome completo")).not.toBeInTheDocument()
  })

  it("deve exibir mensagem de erro quando error é informado", () => {
    const error = { message: "Campo obrigatório", type: "required" }
    render(<CustomInput label="Nome" error={error} />)
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument()
  })

  it("não deve exibir mensagem de erro quando error não é informado", () => {
    render(<CustomInput label="Nome" />)
    expect(screen.queryByText("Campo obrigatório")).not.toBeInTheDocument()
  })

  it("deve renderizar com o type correto", () => {
    render(<CustomInput label="Senha" type="password" />)
    const input = screen.getByLabelText("Senha")
    expect(input).toHaveAttribute("type", "password")
  })

  it("deve ter data-filled false quando o valor está vazio", () => {
    render(<CustomInput label="Nome" value="" onChange={jest.fn()} />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("data-filled", "false")
  })

  it("deve ter data-filled true quando o valor está preenchido", () => {
    render(<CustomInput label="Nome" value="João" onChange={jest.fn()} />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("data-filled", "true")
  })

  it("deve atualizar data-filled para true ao digitar", () => {
    render(<CustomInput label="Nome" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "João" } })
    expect(input).toHaveAttribute("data-filled", "true")
  })

  it("deve atualizar data-filled para false ao limpar o campo", () => {
    render(<CustomInput label="Nome" />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "João" } })
    fireEvent.change(input, { target: { value: "" } })
    expect(input).toHaveAttribute("data-filled", "false")
  })

  it("deve chamar onChange ao digitar", () => {
    const handleChange = jest.fn()
    render(<CustomInput label="Nome" onChange={handleChange} />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "João" } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("não deve quebrar quando onChange não é informado", () => {
    render(<CustomInput label="Nome" />)
    const input = screen.getByRole("textbox")
    expect(() => {
      fireEvent.change(input, { target: { value: "João" } })
    }).not.toThrow()
  })

  it("deve repassar atributos HTML nativos para o input", () => {
    render(<CustomInput label="Nome" data-testid="input-nome" placeholder="Digite seu nome" />)
    const input = screen.getByTestId("input-nome")
    expect(input).toHaveAttribute("placeholder", "Digite seu nome")
  })
})