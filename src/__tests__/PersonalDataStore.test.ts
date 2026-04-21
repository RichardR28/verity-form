import { renderHook, act } from "@testing-library/react"
import usePersonalDataStore from "@/stores/PersonalDataStore"

const emptyPersonalData = {
  nome: "",
  dataNascimento: "",
  cpf: "",
  telefone: "",
  email: "",
}

const mockPersonalData = {
  nome: "João Silva",
  dataNascimento: "01/01/1990",
  cpf: "123.456.789-01",
  telefone: "(11) 98765-4321",
  email: "joao.silva@email.com",
}

describe("usePersonalDataStore", () => {
  beforeEach(() => {
    usePersonalDataStore.setState({ personalData: emptyPersonalData })
  })

  it("deve iniciar com os dados pessoais vazios", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    expect(result.current.personalData).toEqual(emptyPersonalData)
  })

  it("deve iniciar com nome vazio", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    expect(result.current.personalData.nome).toBe("")
  })

  it("deve iniciar com dataNascimento vazia", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    expect(result.current.personalData.dataNascimento).toBe("")
  })

  it("deve iniciar com cpf vazio", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    expect(result.current.personalData.cpf).toBe("")
  })

  it("deve iniciar com telefone vazio", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    expect(result.current.personalData.telefone).toBe("")
  })

  it("deve iniciar com email vazio", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    expect(result.current.personalData.email).toBe("")
  })

  it("deve definir os dados pessoais corretamente", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    act(() => {
      result.current.setPersonalData(mockPersonalData)
    })
    expect(result.current.personalData).toEqual(mockPersonalData)
  })

  it("deve atualizar o nome corretamente", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    act(() => {
      result.current.setPersonalData(mockPersonalData)
    })
    expect(result.current.personalData.nome).toBe("João Silva")
  })

  it("deve atualizar a dataNascimento corretamente", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    act(() => {
      result.current.setPersonalData(mockPersonalData)
    })
    expect(result.current.personalData.dataNascimento).toBe("01/01/1990")
  })

  it("deve atualizar o cpf corretamente", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    act(() => {
      result.current.setPersonalData(mockPersonalData)
    })
    expect(result.current.personalData.cpf).toBe("123.456.789-01")
  })

  it("deve atualizar o telefone corretamente", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    act(() => {
      result.current.setPersonalData(mockPersonalData)
    })
    expect(result.current.personalData.telefone).toBe("(11) 98765-4321")
  })

  it("deve atualizar o email corretamente", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    act(() => {
      result.current.setPersonalData(mockPersonalData)
    })
    expect(result.current.personalData.email).toBe("joao.silva@email.com")
  })

  it("deve sobrescrever os dados ao chamar setPersonalData novamente", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    const newPersonalData = {
      nome: "Maria Souza",
      dataNascimento: "15/06/1985",
      cpf: "987.654.321-00",
      telefone: "(21) 91234-5678",
      email: "maria.souza@email.com",
    }
    act(() => {
      result.current.setPersonalData(mockPersonalData)
    })
    act(() => {
      result.current.setPersonalData(newPersonalData)
    })
    expect(result.current.personalData).toEqual(newPersonalData)
  })

  it("deve resetar os dados ao chamar setPersonalData com valores vazios", () => {
    const { result } = renderHook(() => usePersonalDataStore())
    act(() => {
      result.current.setPersonalData(mockPersonalData)
    })
    act(() => {
      result.current.setPersonalData(emptyPersonalData)
    })
    expect(result.current.personalData).toEqual(emptyPersonalData)
  })

  it("deve manter os dados isolados entre instâncias do hook", () => {
    const { result: result1 } = renderHook(() => usePersonalDataStore())
    const { result: result2 } = renderHook(() => usePersonalDataStore())
    act(() => {
      result1.current.setPersonalData(mockPersonalData)
    })
    expect(result2.current.personalData).toEqual(mockPersonalData)
  })
})