import { renderHook, waitFor, act } from "@testing-library/react"
import { useCep } from "@/hooks/useCep"

globalThis.fetch = jest.fn()

const mockFetch = (data: object, ok = true) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: () => Promise.resolve(data),
  })
}

describe("useCep", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deve retornar null para CEP com menos de 8 dígitos", async () => {
    const { result } = renderHook(() => useCep())
    const data = await result.current.fetchCep("1234567")
    expect(data).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it("deve retornar null para CEP vazio", async () => {
    const { result } = renderHook(() => useCep())
    const data = await result.current.fetchCep("")
    expect(data).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it("deve buscar CEP e retornar os dados corretamente", async () => {
    mockFetch({
      logradouro: "Rua Presidente Prudente de Moraes",
      bairro: "Santo Antônio",
      localidade: "Joinville",
      uf: "SC",
    })

    const { result } = renderHook(() => useCep())

    const data = await waitFor(async () => {
      return await result.current.fetchCep("89218001")
    })

    expect(data).toEqual({
      logradouro: "Rua Presidente Prudente de Moraes",
      bairro: "Santo Antônio",
      localidade: "Joinville",
      uf: "SC",
    })
    expect(fetch).toHaveBeenCalledWith("https://viacep.com.br/ws/89218001/json/")
  })

  it("deve remover máscara antes de buscar", async () => {
    mockFetch({
      logradouro: "Rua Teste",
      bairro: "Bairro Teste",
      localidade: "Cidade Teste",
      uf: "SC",
    })

    const { result } = renderHook(() => useCep())

    await waitFor(async () => {
      await result.current.fetchCep("89218-001")
    })

    expect(fetch).toHaveBeenCalledWith("https://viacep.com.br/ws/89218001/json/")
  })

  it("deve retornar null e setar erro para CEP não encontrado", async () => {
    mockFetch({ erro: true })

    const { result } = renderHook(() => useCep())


    const data = await act(async () => {
      return await result.current.fetchCep("00000000")
    })

    expect(data).toBeNull()
    expect(result.current.error).toBe("CEP não encontrado")
  })

  it("deve retornar null e setar erro em caso de falha na requisição", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"))

    const { result } = renderHook(() => useCep())

    const data = await act(async () => {
      return await result.current.fetchCep("89218001")
    })

    expect(data).toBeNull()
    expect(result.current.error).toBe("Erro ao buscar CEP")
  })

  it("deve setar loading como true durante a busca e false ao finalizar", async () => {
    mockFetch({
      logradouro: "Rua Teste",
      bairro: "Bairro Teste",
      localidade: "Cidade Teste",
      uf: "SC",
    })

    const { result } = renderHook(() => useCep())

    await waitFor(async () => {
      await result.current.fetchCep("89218001")
    })

    expect(result.current.loading).toBe(false)
  })
})