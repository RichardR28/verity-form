import { renderHook, act } from "@testing-library/react"
import useProfessionalDataStore from "@/stores/ProfessionalDataStore"

const emptyProfessionalData = {
  empresa: "",
  profissao: "",
  salario: "",
  tempoEmpresa: "",
}

const mockProfessionalData = {
  empresa: "Empresa XYZ",
  profissao: "Engenheiro de Software",
  salario: "10.000,00",
  tempoEmpresa: "3 anos",
}

describe("useProfessionalDataStore", () => {
  beforeEach(() => {
    useProfessionalDataStore.setState({ professionalData: emptyProfessionalData })
  })

  it("deve iniciar com os dados profissionais vazios", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    expect(result.current.professionalData).toEqual(emptyProfessionalData)
  })

  it("deve iniciar com empresa vazia", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    expect(result.current.professionalData.empresa).toBe("")
  })

  it("deve iniciar com profissao vazia", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    expect(result.current.professionalData.profissao).toBe("")
  })

  it("deve iniciar com salario vazio", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    expect(result.current.professionalData.salario).toBe("")
  })

  it("deve iniciar com tempoEmpresa vazio", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    expect(result.current.professionalData.tempoEmpresa).toBe("")
  })

  it("deve definir os dados profissionais corretamente", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    act(() => {
      result.current.setProfessionalData(mockProfessionalData)
    })
    expect(result.current.professionalData).toEqual(mockProfessionalData)
  })

  it("deve atualizar a empresa corretamente", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    act(() => {
      result.current.setProfessionalData(mockProfessionalData)
    })
    expect(result.current.professionalData.empresa).toBe("Empresa XYZ")
  })

  it("deve atualizar a profissao corretamente", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    act(() => {
      result.current.setProfessionalData(mockProfessionalData)
    })
    expect(result.current.professionalData.profissao).toBe("Engenheiro de Software")
  })

  it("deve atualizar o salario corretamente", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    act(() => {
      result.current.setProfessionalData(mockProfessionalData)
    })
    expect(result.current.professionalData.salario).toBe("10.000,00")
  })

  it("deve atualizar o tempoEmpresa corretamente", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    act(() => {
      result.current.setProfessionalData(mockProfessionalData)
    })
    expect(result.current.professionalData.tempoEmpresa).toBe("3 anos")
  })

  it("deve sobrescrever os dados ao chamar setProfessionalData novamente", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    const newProfessionalData = {
      empresa: "Nova Empresa LTDA",
      profissao: "Analista de Sistemas",
      salario: "8.000,00",
      tempoEmpresa: "1 ano",
    }
    act(() => {
      result.current.setProfessionalData(mockProfessionalData)
    })
    act(() => {
      result.current.setProfessionalData(newProfessionalData)
    })
    expect(result.current.professionalData).toEqual(newProfessionalData)
  })

  it("deve resetar os dados ao chamar setProfessionalData com valores vazios", () => {
    const { result } = renderHook(() => useProfessionalDataStore())
    act(() => {
      result.current.setProfessionalData(mockProfessionalData)
    })
    act(() => {
      result.current.setProfessionalData(emptyProfessionalData)
    })
    expect(result.current.professionalData).toEqual(emptyProfessionalData)
  })

  it("deve manter os dados isolados entre instâncias do hook", () => {
    const { result: result1 } = renderHook(() => useProfessionalDataStore())
    const { result: result2 } = renderHook(() => useProfessionalDataStore())
    act(() => {
      result1.current.setProfessionalData(mockProfessionalData)
    })
    expect(result2.current.professionalData).toEqual(mockProfessionalData)
  })
})