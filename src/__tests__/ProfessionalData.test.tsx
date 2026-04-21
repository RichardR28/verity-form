import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ProfessionalData from "@/views/professionalData/ProfessionalData"
import useProfessionalDataStore from "@/stores/ProfessionalDataStore"
import { useProfissoes } from "@/hooks/useProfissoes"

jest.mock("@/hooks/useProfissoes")

const mockProfissoes = [
  { id: 1, value: "Engenheiro de Software" },
  { id: 2, value: "Analista de Sistemas" },
  { id: 3, value: "Designer" },
]

const emptyProfessionalData = {
  empresa: "",
  profissao: "",
  salario: "",
  tempoEmpresa: "",
}

function renderComponent(onPageChange = jest.fn()) {
  return render(<ProfessionalData onPageChange={onPageChange} />)
}

describe("ProfessionalData", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useProfessionalDataStore.setState({ professionalData: emptyProfessionalData });
    (useProfissoes as jest.Mock).mockReturnValue({
      profissoes: mockProfissoes,
      loading: false,
      error: null,
    })
  })

  it("deve renderizar o título corretamente", () => {
    renderComponent()
    expect(screen.getByText("Dados Profissionais")).toBeInTheDocument()
  })

  it("deve renderizar o campo Empresa", () => {
    renderComponent()
    expect(screen.getByLabelText("Empresa*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Profissão", () => {
    renderComponent()
    expect(screen.getByLabelText("Profissão*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Salário", () => {
    renderComponent()
    expect(screen.getByLabelText("Salário*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Tempo de Empresa", () => {
    renderComponent()
    expect(screen.getByLabelText("Tempo de Empresa*")).toBeInTheDocument()
  })

  it("deve renderizar o botão Continuar", () => {
    renderComponent()
    expect(screen.getByRole("button", { name: /continuar/i })).toBeInTheDocument()
  })

  it("deve renderizar as opções de profissão retornadas pelo hook", () => {
    renderComponent()
    expect(screen.getByText("Engenheiro de Software")).toBeInTheDocument()
    expect(screen.getByText("Analista de Sistemas")).toBeInTheDocument()
    expect(screen.getByText("Designer")).toBeInTheDocument()
  })

  it("deve renderizar o placeholder do select de profissão", () => {
    renderComponent()
    expect(screen.getByText("Informe sua profissão")).toBeInTheDocument()
  })

  it("deve desabilitar o select de profissão enquanto loading é true", () => {
    (useProfissoes as jest.Mock).mockReturnValue({
      profissoes: [],
      loading: true,
      error: null,
    })
    renderComponent()
    expect(screen.getByLabelText("Profissão*")).toBeDisabled()
  })

  it("deve habilitar o select de profissão quando loading é false", () => {
    renderComponent()
    expect(screen.getByLabelText("Profissão*")).not.toBeDisabled()
  })

  it("não deve renderizar opções quando loading é true", () => {
    (useProfissoes as jest.Mock).mockReturnValue({
      profissoes: [],
      loading: true,
      error: null,
    })
    renderComponent()
    expect(screen.queryByText("Engenheiro de Software")).not.toBeInTheDocument()
  })

  it("deve preencher os campos com os dados da store", () => {
    useProfessionalDataStore.setState({
      professionalData: {
        empresa: "Empresa XYZ",
        profissao: "1",
        salario: "10000",
        tempoEmpresa: "3 anos",
      }
    })
    renderComponent()
    expect(screen.getByLabelText("Empresa*")).toHaveValue("Empresa XYZ")
    expect(screen.getByLabelText("Tempo de Empresa*")).toHaveValue("3 anos")
  })

  it("deve exibir erro ao submeter com empresa vazia", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o nome da empresa")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com profissão vazia", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher a profissão")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com salário vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o salário")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com tempo de empresa vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o tempo de empresa")).toBeInTheDocument()
    })
  })

  it("deve salvar os dados na store e chamar onPageChange(3) ao submeter formulário válido", async () => {
    const onPageChange = jest.fn()
    renderComponent(onPageChange)

    fireEvent.change(screen.getByLabelText("Empresa*"), { target: { value: "Empresa XYZ" } })
    fireEvent.change(screen.getByLabelText("Profissão*"), { target: { value: "1" } })
    fireEvent.change(screen.getByLabelText("Salário*"), { target: { value: "10000" } })
    fireEvent.change(screen.getByLabelText("Tempo de Empresa*"), { target: { value: "3 anos" } })
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))

    await waitFor(() => {
      expect(onPageChange).toHaveBeenCalledWith(3)
      const { professionalData } = useProfessionalDataStore.getState()
      expect(professionalData.empresa).toBe("Empresa XYZ")
      expect(professionalData.tempoEmpresa).toBe("3 anos")
    })
  })

  it("não deve chamar onPageChange se o formulário tiver erros", async () => {
    const onPageChange = jest.fn()
    renderComponent(onPageChange)
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(onPageChange).not.toHaveBeenCalled()
    })
  })
})