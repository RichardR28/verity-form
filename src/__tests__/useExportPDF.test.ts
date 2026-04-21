import { renderHook, act } from "@testing-library/react"

const mockPdfInstance = {
  addImage: jest.fn(),
  text: jest.fn(),
  line: jest.fn(),
  setFontSize: jest.fn(),
  setFont: jest.fn(),
  setDrawColor: jest.fn(),
  getTextWidth: jest.fn(() => 20),
  save: jest.fn(),
}

jest.mock("jspdf", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockPdfInstance),
}))

jest.mock("@/assets/logoVRT.png", () => "logo-mock.png")

global.Image = class {
  onload: () => void = () => { }
  set src(_: string) {
    this.onload()
  }
} as any

HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  drawImage: jest.fn(),
})
HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue(
  "data:image/png;base64,mockbase64"
)

import { useExportPdf } from "@/hooks/useExportPDF"

const mockData = {
  personalData: {
    nome: "João Silva",
    dataNascimento: "01/01/1990",
    cpf: "123.456.789-00",
    email: "joao@email.com",
    telefone: "(47) 99999-9999",
  },
  addressData: {
    cep: "89218-001",
    endereco: "Rua Presidente Prudente de Moraes",
    bairro: "Santo Antônio",
    cidade: "Joinville",
    estado: "SC",
  },
  professionalData: {
    empresa: "Empresa Teste",
    profissao: "Engenheiro",
    salario: "R$ 5.000,00",
    tempoEmpresa: "2 anos",
  },
}

describe("useExportPdf", () => {
  beforeEach(() => {
    // Limpa apenas as chamadas, sem destruir a implementação
    Object.values(mockPdfInstance).forEach((fn) => {
      if (typeof fn === "function") (fn as jest.Mock).mockClear()
    })
    // Restaura o retorno padrão do getTextWidth após o clear
    mockPdfInstance.getTextWidth.mockReturnValue(20)
  })

  it("deve retornar a função exportPdf", () => {
    const { result } = renderHook(() => useExportPdf())
    expect(result.current.exportPdf).toBeDefined()
    expect(typeof result.current.exportPdf).toBe("function")
  })

  it("deve chamar pdf.save com o nome correto", async () => {
    const { result } = renderHook(() => useExportPdf())

    await act(async () => {
      await result.current.exportPdf(mockData)
    })

    expect(mockPdfInstance.save).toHaveBeenCalledWith("relatorio_verity.pdf")
    expect(mockPdfInstance.save).toHaveBeenCalledTimes(1)
  })

  it("deve adicionar a logo no PDF", async () => {
    const { result } = renderHook(() => useExportPdf())

    await act(async () => {
      await result.current.exportPdf(mockData)
    })

    expect(mockPdfInstance.addImage).toHaveBeenCalledWith(
      "data:image/png;base64,mockbase64",
      "PNG",
      20,
      8,
      30,
      10
    )
  })

  it("deve escrever os dados pessoais no PDF", async () => {
    const { result } = renderHook(() => useExportPdf())

    await act(async () => {
      await result.current.exportPdf(mockData)
    })

    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("João Silva"),
      expect.any(Number),
      expect.any(Number)
    )
    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("123.456.789-00"),
      expect.any(Number),
      expect.any(Number)
    )
    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("joao@email.com"),
      expect.any(Number),
      expect.any(Number)
    )
  })

  it("deve escrever os dados de endereço no PDF", async () => {
    const { result } = renderHook(() => useExportPdf())

    await act(async () => {
      await result.current.exportPdf(mockData)
    })

    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("89218-001"),
      expect.any(Number),
      expect.any(Number)
    )
    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("Joinville"),
      expect.any(Number),
      expect.any(Number)
    )
    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("SC"),
      expect.any(Number),
      expect.any(Number)
    )
  })

  it("deve escrever os dados profissionais no PDF", async () => {
    const { result } = renderHook(() => useExportPdf())

    await act(async () => {
      await result.current.exportPdf(mockData)
    })

    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("Empresa Teste"),
      expect.any(Number),
      expect.any(Number)
    )
    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("Engenheiro"),
      expect.any(Number),
      expect.any(Number)
    )
    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      expect.stringContaining("R$ 5.000,00"),
      expect.any(Number),
      expect.any(Number)
    )
  })

  it("deve escrever os títulos das seções", async () => {
    const { result } = renderHook(() => useExportPdf())

    await act(async () => {
      await result.current.exportPdf(mockData)
    })

    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      "Dados Pessoais",
      105,
      expect.any(Number),
      { align: "center" }
    )
    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      "Endereço",
      105,
      expect.any(Number),
      { align: "center" }
    )
    expect(mockPdfInstance.text).toHaveBeenCalledWith(
      "Dados Profissionais",
      105,
      expect.any(Number),
      { align: "center" }
    )
  })

  it("deve desenhar os divisores entre seções", async () => {
    const { result } = renderHook(() => useExportPdf())

    await act(async () => {
      await result.current.exportPdf(mockData)
    })

    expect(mockPdfInstance.line).toHaveBeenCalled()
    expect(mockPdfInstance.setDrawColor).toHaveBeenCalledWith(200, 200, 200)
  })
})