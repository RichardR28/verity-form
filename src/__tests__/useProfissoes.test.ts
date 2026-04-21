// src/__tests__/useProfissoes.test.ts
import { renderHook, waitFor } from "@testing-library/react"
import { useProfissoes } from "@/hooks/useProfissoes"

globalThis.fetch = jest.fn()

const mockProfissoes = [
  { id: 1, value: "Engenheiro" },
  { id: 2, value: "Médico" },
  { id: 3, value: "Advogado" },
]

const mockFetch = (data: object, ok = true) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: () => Promise.resolve(data),
  })
}

describe("useProfissoes", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deve iniciar com valores padrão", async () => {
    mockFetch(mockProfissoes)

    const { result } = renderHook(() => useProfissoes())

    expect(result.current.profissoes).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()

    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it("deve buscar e retornar as profissões corretamente", async () => {
    mockFetch(mockProfissoes)

    const { result } = renderHook(() => useProfissoes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profissoes).toEqual(mockProfissoes)
    expect(result.current.error).toBeNull()
  })

  it("deve chamar a URL correta", async () => {
    mockFetch(mockProfissoes)

    const { result } = renderHook(() => useProfissoes())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/profissoes")
    )
  })

  it("deve setar loading como true durante a busca e false ao finalizar", async () => {
    mockFetch(mockProfissoes)

    const { result } = renderHook(() => useProfissoes())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("deve setar erro em caso de falha na requisição", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"))

    const { result } = renderHook(() => useProfissoes())

    await waitFor(() => {
      expect(result.current.error).toBe("Erro ao carregar profissões")
    })

    expect(result.current.profissoes).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it("deve retornar lista vazia em caso de erro", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"))

    const { result } = renderHook(() => useProfissoes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.profissoes).toEqual([])
  })
})