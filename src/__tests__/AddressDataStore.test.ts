import { renderHook, act } from "@testing-library/react"
import useAddressDataStore from "@/stores/AddressDataStore"

const emptyAddressData = {
  cep: "",
  endereco: "",
  bairro: "",
  cidade: "",
  estado: "",
}

const mockAddressData = {
  cep: "89200-000",
  endereco: "Rua das Flores",
  bairro: "Centro",
  cidade: "Joinville",
  estado: "SC",
}

describe("useAddressDataStore", () => {
  beforeEach(() => {
    useAddressDataStore.setState({ addressData: emptyAddressData })
  })

  it("deve iniciar com os dados de endereço vazios", () => {
    const { result } = renderHook(() => useAddressDataStore())
    expect(result.current.addressData).toEqual(emptyAddressData)
  })

  it("deve iniciar com cep vazio", () => {
    const { result } = renderHook(() => useAddressDataStore())
    expect(result.current.addressData.cep).toBe("")
  })

  it("deve iniciar com endereco vazio", () => {
    const { result } = renderHook(() => useAddressDataStore())
    expect(result.current.addressData.endereco).toBe("")
  })

  it("deve iniciar com bairro vazio", () => {
    const { result } = renderHook(() => useAddressDataStore())
    expect(result.current.addressData.bairro).toBe("")
  })

  it("deve iniciar com cidade vazia", () => {
    const { result } = renderHook(() => useAddressDataStore())
    expect(result.current.addressData.cidade).toBe("")
  })

  it("deve iniciar com estado vazio", () => {
    const { result } = renderHook(() => useAddressDataStore())
    expect(result.current.addressData.estado).toBe("")
  })

  it("deve definir os dados de endereço corretamente", () => {
    const { result } = renderHook(() => useAddressDataStore())
    act(() => {
      result.current.setAddressData(mockAddressData)
    })
    expect(result.current.addressData).toEqual(mockAddressData)
  })

  it("deve atualizar o cep corretamente", () => {
    const { result } = renderHook(() => useAddressDataStore())
    act(() => {
      result.current.setAddressData(mockAddressData)
    })
    expect(result.current.addressData.cep).toBe("89200-000")
  })

  it("deve atualizar o endereco corretamente", () => {
    const { result } = renderHook(() => useAddressDataStore())
    act(() => {
      result.current.setAddressData(mockAddressData)
    })
    expect(result.current.addressData.endereco).toBe("Rua das Flores")
  })

  it("deve atualizar o bairro corretamente", () => {
    const { result } = renderHook(() => useAddressDataStore())
    act(() => {
      result.current.setAddressData(mockAddressData)
    })
    expect(result.current.addressData.bairro).toBe("Centro")
  })

  it("deve atualizar a cidade corretamente", () => {
    const { result } = renderHook(() => useAddressDataStore())
    act(() => {
      result.current.setAddressData(mockAddressData)
    })
    expect(result.current.addressData.cidade).toBe("Joinville")
  })

  it("deve atualizar o estado corretamente", () => {
    const { result } = renderHook(() => useAddressDataStore())
    act(() => {
      result.current.setAddressData(mockAddressData)
    })
    expect(result.current.addressData.estado).toBe("SC")
  })

  it("deve sobrescrever os dados ao chamar setAddressData novamente", () => {
    const { result } = renderHook(() => useAddressDataStore())
    const newAddressData = {
      cep: "01310-100",
      endereco: "Avenida Paulista",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
    }
    act(() => {
      result.current.setAddressData(mockAddressData)
    })
    act(() => {
      result.current.setAddressData(newAddressData)
    })
    expect(result.current.addressData).toEqual(newAddressData)
  })

  it("deve resetar os dados ao chamar setAddressData com valores vazios", () => {
    const { result } = renderHook(() => useAddressDataStore())
    act(() => {
      result.current.setAddressData(mockAddressData)
    })
    act(() => {
      result.current.setAddressData(emptyAddressData)
    })
    expect(result.current.addressData).toEqual(emptyAddressData)
  })

  it("deve manter os dados isolados entre instâncias do hook", () => {
    const { result: result1 } = renderHook(() => useAddressDataStore())
    const { result: result2 } = renderHook(() => useAddressDataStore())
    act(() => {
      result1.current.setAddressData(mockAddressData)
    })
    expect(result2.current.addressData).toEqual(mockAddressData)
  })
})