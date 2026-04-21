import { render, screen, fireEvent } from "@testing-library/react"
import Summary from "@/views/summary/Summary"
import usePersonalDataStore from "@/stores/PersonalDataStore"
import useAddressDataStore from "@/stores/AddressDataStore"
import useProfessionalDataStore from "@/stores/ProfessionalDataStore"
import { useExportPdf } from "@/hooks/useExportPDF"

jest.mock("@/hooks/useExportPDF", () => ({
  useExportPdf: jest.fn()
}))

const mockExportPdf = jest.fn()

const mockPersonalData = {
  nome: "João Silva",
  dataNascimento: "1990-01-15",
  cpf: "12345678901",
  telefone: "11987654321",
  email: "joao@email.com",
}

const mockAddressData = {
  cep: "89200000",
  endereco: "Rua das Flores",
  bairro: "Centro",
  cidade: "Joinville",
  estado: "SC",
}

const mockProfessionalData = {
  empresa: "Empresa XYZ",
  profissao: "Engenheiro de Software",
  salario: "10000",
  tempoEmpresa: "3 anos",
}

function renderComponent(onPageChange = jest.fn()) {
  return render(<Summary onPageChange={onPageChange} />)
}

describe("Summary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useExportPdf as jest.Mock).mockReturnValue({ exportPdf: mockExportPdf })
    usePersonalDataStore.setState({ personalData: mockPersonalData })
    useAddressDataStore.setState({ addressData: mockAddressData })
    useProfessionalDataStore.setState({ professionalData: mockProfessionalData })
  })

  it("deve renderizar o título principal", () => {
    renderComponent()
    expect(screen.getByText("Informações")).toBeInTheDocument()
  })

  it("deve renderizar o título de Dados Pessoais", () => {
    renderComponent()
    expect(screen.getByText("Dados Pessoais")).toBeInTheDocument()
  })

  it("deve renderizar o título de Endereço", () => {
    renderComponent()
    expect(screen.getByText("Endereço")).toBeInTheDocument()
  })

  it("deve renderizar o título de Dados Profissionais", () => {
    renderComponent()
    expect(screen.getByText("Dados Profissionais")).toBeInTheDocument()
  })

  it("deve renderizar o botão Corrigir", () => {
    renderComponent()
    expect(screen.getByRole("button", { name: /corrigir/i })).toBeInTheDocument()
  })

  it("deve renderizar o botão Exportar PDF", () => {
    renderComponent()
    expect(screen.getByRole("button", { name: /exportar pdf/i })).toBeInTheDocument()
  })

  it("deve exibir o nome corretamente", () => {
    renderComponent()
    expect(screen.getByText(/João Silva/)).toBeInTheDocument()
  })

  it("deve exibir a data de nascimento formatada", () => {
    renderComponent()
    expect(screen.getByText(/15\/01\/1990/)).toBeInTheDocument()
  })

  it("deve exibir o CPF formatado", () => {
    renderComponent()
    expect(screen.getByText(/123\.456\.789-01/)).toBeInTheDocument()
  })

  it("deve exibir o email corretamente", () => {
    renderComponent()
    expect(screen.getByText(/joao@email.com/)).toBeInTheDocument()
  })

  it("deve exibir o telefone formatado com 11 dígitos", () => {
    renderComponent()
    expect(screen.getByText(/\(11\) 98765-4321/)).toBeInTheDocument()
  })

  it("deve exibir o telefone formatado com 10 dígitos", () => {
    usePersonalDataStore.setState({
      personalData: { ...mockPersonalData, telefone: "1187654321" }
    })
    renderComponent()
    expect(screen.getByText(/\(11\) 8765-4321/)).toBeInTheDocument()
  })

  it("deve exibir o CEP formatado", () => {
    renderComponent()
    expect(screen.getByText(/89200-000/)).toBeInTheDocument()
  })

  it("deve exibir o endereço corretamente", () => {
    renderComponent()
    expect(screen.getByText(/Rua das Flores/)).toBeInTheDocument()
  })

  it("deve exibir o bairro corretamente", () => {
    renderComponent()
    expect(screen.getByText(/Centro/)).toBeInTheDocument()
  })

  it("deve exibir a cidade corretamente", () => {
    renderComponent()
    expect(screen.getByText(/Joinville/)).toBeInTheDocument()
  })

  it("deve exibir o estado corretamente", () => {
    renderComponent()
    expect(screen.getByText(/SC/)).toBeInTheDocument()
  })

  it("deve exibir a empresa corretamente", () => {
    renderComponent()
    expect(screen.getByText(/Empresa XYZ/)).toBeInTheDocument()
  })

  it("deve exibir a profissão corretamente", () => {
    renderComponent()
    expect(screen.getByText(/Engenheiro de Software/)).toBeInTheDocument()
  })

  it("deve exibir o salário formatado em BRL", () => {
    renderComponent()
    expect(screen.getByText(/R\$\s*10\.000,00/)).toBeInTheDocument()
  })

  it("deve exibir o tempo de empresa corretamente", () => {
    renderComponent()
    expect(screen.getByText(/3 anos/)).toBeInTheDocument()
  })

  it("deve chamar onPageChange(0) ao clicar em Corrigir", () => {
    const onPageChange = jest.fn()
    renderComponent(onPageChange)
    fireEvent.click(screen.getByRole("button", { name: /corrigir/i }))
    expect(onPageChange).toHaveBeenCalledWith(0)
  })

  it("deve chamar exportPdf ao clicar em Exportar PDF", () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /exportar pdf/i }))
    expect(mockExportPdf).toHaveBeenCalledTimes(1)
  })

  it("deve chamar exportPdf com os dados formatados corretamente", () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /exportar pdf/i }))
    expect(mockExportPdf).toHaveBeenCalledWith({
      personalData: {
        nome: "João Silva",
        dataNascimento: "15/01/1990",
        cpf: "123.456.789-01",
        telefone: "(11) 98765-4321",
        email: "joao@email.com",
      },
      addressData: {
        cep: "89200-000",
        endereco: "Rua das Flores",
        bairro: "Centro",
        cidade: "Joinville",
        estado: "SC",
      },
      professionalData: {
        empresa: "Empresa XYZ",
        profissao: "Engenheiro de Software",
        salario: "R$\u00a010.000,00",
        tempoEmpresa: "3 anos",
      },
    })
  })
})