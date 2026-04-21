import { render, screen, fireEvent } from "@testing-library/react"
import Button from "@/components/Button"

describe("Button", () => {
  it("deve renderizar o botão com o label correto", () => {
    render(<Button label="Clique aqui" />)
    expect(screen.getByText("Clique aqui")).toBeInTheDocument()
  })

  it("deve renderizar o variant primary por padrão quando não informado", () => {
    render(<Button label="Botão" />)
    const button = screen.getByText("Botão")
    expect(button).toHaveClass("bg-[#0041fe]")
  })

  it("deve renderizar o variant primary quando informado", () => {
    render(<Button label="Botão Primary" variant="primary" />)
    const button = screen.getByText("Botão Primary")
    expect(button).toHaveClass("bg-[#0041fe]")
  })

  it("deve renderizar o variant danger quando informado", () => {
    render(<Button label="Botão Danger" variant="danger" />)
    const button = screen.getByText("Botão Danger")
    expect(button).toHaveClass("bg-red-500")
  })

  it("não deve renderizar o variant primary quando variant é danger", () => {
    render(<Button label="Botão Danger" variant="danger" />)
    const button = screen.getByText("Botão Danger")
    expect(button).not.toHaveClass("bg-[#0041fe]")
  })

  it("não deve renderizar o variant danger quando variant é primary", () => {
    render(<Button label="Botão Primary" variant="primary" />)
    const button = screen.getByText("Botão Primary")
    expect(button).not.toHaveClass("bg-red-500")
  })

  it("deve chamar onClick quando clicado", () => {
    const handleClick = jest.fn()
    render(<Button label="Clique aqui" onClick={handleClick} />)
    fireEvent.click(screen.getByText("Clique aqui"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("deve estar desabilitado quando a prop disabled é passada", () => {
    render(<Button label="Botão" disabled />)
    expect(screen.getByText("Botão")).toBeDisabled()
  })

  it("não deve chamar onClick quando está desabilitado", () => {
    const handleClick = jest.fn()
    render(<Button label="Botão" disabled onClick={handleClick} />)
    fireEvent.click(screen.getByText("Botão"))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("deve repassar atributos HTML nativos para o botão", () => {
    render(<Button label="Botão" type="submit" data-testid="btn-submit" />)
    const button = screen.getByTestId("btn-submit")
    expect(button).toHaveAttribute("type", "submit")
  })
})