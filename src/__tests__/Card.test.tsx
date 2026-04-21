import { render, screen } from "@testing-library/react"
import Card from "@/components/Card"

describe("Card", () => {
  it("deve renderizar o componente Card", () => {
    render(<Card>Conteúdo</Card>)
    expect(screen.getByText("Conteúdo")).toBeInTheDocument()
  })

  it("deve renderizar com o id formCard", () => {
    render(<Card>Conteúdo</Card>)
    expect(document.getElementById("formCard")).toBeInTheDocument()
  })

  it("deve renderizar como uma tag section", () => {
    render(<Card>Conteúdo</Card>)
    const section = document.getElementById("formCard")
    expect(section?.tagName).toBe("SECTION")
  })

  it("deve renderizar os children corretamente", () => {
    render(
      <Card>
        <p>Filho 1</p>
        <p>Filho 2</p>
      </Card>
    )
    expect(screen.getByText("Filho 1")).toBeInTheDocument()
    expect(screen.getByText("Filho 2")).toBeInTheDocument()
  })

  it("deve renderizar children do tipo string", () => {
    render(<Card>Texto simples</Card>)
    expect(screen.getByText("Texto simples")).toBeInTheDocument()
  })

  it("deve renderizar children do tipo componente", () => {
    render(
      <Card>
        <button>Botão</button>
      </Card>
    )
    expect(screen.getByRole("button", { name: "Botão" })).toBeInTheDocument()
  })

  it("deve renderizar múltiplos tipos de children", () => {
    render(
      <Card>
        <h1>Título</h1>
        <p>Parágrafo</p>
        <button>Botão</button>
      </Card>
    )
    expect(screen.getByText("Título")).toBeInTheDocument()
    expect(screen.getByText("Parágrafo")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Botão" })).toBeInTheDocument()
  })
})