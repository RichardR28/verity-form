import { render, screen, fireEvent } from "@testing-library/react"
import CustomSelect from "@/components/CustomSelect"

const mockOptions = [
  { id: "1", value: "Opção 1" },
  { id: "2", value: "Opção 2" },
  { id: "3", value: "Opção 3" },
]

describe("CustomSelect", () => {
  it("deve renderizar o label corretamente", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    expect(screen.getByText("Categoria")).toBeInTheDocument()
  })

  it("deve renderizar o select na tela", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("deve associar o label ao select via htmlFor", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    const label = screen.getByText("Categoria")
    expect(label).toHaveAttribute("for", "Categoria")
  })

  it("deve renderizar a descrição quando informada", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} description="Selecione uma categoria" />)
    expect(screen.getByText("Selecione uma categoria")).toBeInTheDocument()
  })

  it("não deve renderizar a descrição quando não informada", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    expect(screen.queryByText("Selecione uma categoria")).not.toBeInTheDocument()
  })

  it("deve renderizar o placeholder quando informado", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} placeholder="Selecione..." />)
    expect(screen.getByText("Selecione...")).toBeInTheDocument()
  })

  it("não deve renderizar o placeholder quando não informado", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    expect(screen.queryByText("Selecione...")).not.toBeInTheDocument()
  })

  it("deve renderizar todas as opções corretamente", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    expect(screen.getByText("Opção 1")).toBeInTheDocument()
    expect(screen.getByText("Opção 2")).toBeInTheDocument()
    expect(screen.getByText("Opção 3")).toBeInTheDocument()
  })

  it("deve exibir mensagem de erro quando error é informado", () => {
    const error = { message: "Campo obrigatório", type: "required" }
    render(<CustomSelect label="Categoria" options={mockOptions} error={error} />)
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument()
  })

  it("não deve exibir mensagem de erro quando error não é informado", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    expect(screen.queryByText("Campo obrigatório")).not.toBeInTheDocument()
  })

  it("deve ter data-filled false por padrão", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    const select = screen.getByRole("combobox")
    expect(select).toHaveAttribute("data-filled", "false")
  })

  it("deve ter data-filled true ao selecionar uma opção", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    const select = screen.getByRole("combobox")
    fireEvent.change(select, { target: { value: "1" } })
    expect(select).toHaveAttribute("data-filled", "true")
  })

  it("deve ter data-filled false ao selecionar o placeholder", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} placeholder="Selecione..." />)
    const select = screen.getByRole("combobox")
    fireEvent.change(select, { target: { value: "1" } })
    fireEvent.change(select, { target: { value: "" } })
    expect(select).toHaveAttribute("data-filled", "false")
  })

  it("deve chamar onChange ao selecionar uma opção", () => {
    const handleChange = jest.fn()
    render(<CustomSelect label="Categoria" options={mockOptions} onChange={handleChange} />)
    const select = screen.getByRole("combobox")
    fireEvent.change(select, { target: { value: "1" } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("não deve quebrar quando onChange não é informado", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} />)
    const select = screen.getByRole("combobox")
    expect(() => {
      fireEvent.change(select, { target: { value: "1" } })
    }).not.toThrow()
  })

  it("deve repassar atributos HTML nativos para o select", () => {
    render(<CustomSelect label="Categoria" options={mockOptions} data-testid="select-categoria" />)
    expect(screen.getByTestId("select-categoria")).toBeInTheDocument()
  })

  it("deve aceitar options com id numérico", () => {
    const numericOptions = [
      { id: 1, value: "Opção A" },
      { id: 2, value: "Opção B" },
    ]
    render(<CustomSelect label="Categoria" options={numericOptions} />)
    expect(screen.getByText("Opção A")).toBeInTheDocument()
    expect(screen.getByText("Opção B")).toBeInTheDocument()
  })
})