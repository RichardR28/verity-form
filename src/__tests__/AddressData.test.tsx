import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AddressData from "@/views/addressData/AddressData"
import useAddressDataStore from "@/stores/AddressDataStore"

globalThis.fetch = jest.fn()

const mockFetch = (data: object) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  })
}

const mockCepResponse = {
  logradouro: "Rua das Flores",
  bairro: "Centro",
  localidade: "Joinville",
  uf: "SC",
}

const emptyAddressData = {
  cep: "",
  endereco: "",
  bairro: "",
  cidade: "",
  estado: "",
}

function renderComponent(onPageChange = jest.fn()) {
  return render(<AddressData onPageChange={onPageChange} />)
}

describe("AddressData", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useAddressDataStore.setState({ addressData: emptyAddressData })
  })

  it("deve renderizar o título corretamente", () => {
    renderComponent()
    expect(screen.getByText("Endereço")).toBeInTheDocument()
  })

  it("deve renderizar o campo CEP", () => {
    renderComponent()
    expect(screen.getByLabelText("CEP*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Endereço", () => {
    renderComponent()
    expect(screen.getByLabelText("Endereço*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Bairro", () => {
    renderComponent()
    expect(screen.getByLabelText("Bairro*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Cidade", () => {
    renderComponent()
    expect(screen.getByLabelText("Cidade*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Estado", () => {
    renderComponent()
    expect(screen.getByLabelText("Estado*")).toBeInTheDocument()
  })

  it("deve renderizar o botão Continuar", () => {
    renderComponent()
    expect(screen.getByRole("button", { name: /continuar/i })).toBeInTheDocument()
  })

  it("deve preencher os campos com os dados da store", () => {
    useAddressDataStore.setState({
      addressData: {
        cep: "89200000",
        endereco: "Rua das Flores",
        bairro: "Centro",
        cidade: "Joinville",
        estado: "SC",
      }
    })
    renderComponent()
    expect(screen.getByLabelText("Endereço*")).toHaveValue("Rua das Flores")
    expect(screen.getByLabelText("Bairro*")).toHaveValue("Centro")
    expect(screen.getByLabelText("Cidade*")).toHaveValue("Joinville")
    expect(screen.getByLabelText("Estado*")).toHaveValue("SC")
  })

  it("deve exibir erro ao submeter com CEP vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o CEP")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com CEP menor que 8 dígitos", async () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText("CEP*"), { target: { value: "1234567" } })
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("CEP deve ter 8 dígitos")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com endereço vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o endereço")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com bairro vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o bairro")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com cidade vazia", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher a cidade")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com estado vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o estado")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com estado diferente de 2 caracteres", async () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText("Estado*"), { target: { value: "Santa Catarina" } })
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Estado deve ter 2 caracteres")).toBeInTheDocument()
    })
  })

  it("deve preencher os campos ao buscar CEP válido no onBlur", async () => {
    mockFetch(mockCepResponse)
    renderComponent()
    fireEvent.change(screen.getByLabelText("CEP*"), { target: { value: "89200000" } })
    fireEvent.blur(screen.getByLabelText("CEP*"))
    await waitFor(() => {
      expect(screen.getByLabelText("Endereço*")).toHaveValue("Rua das Flores")
      expect(screen.getByLabelText("Bairro*")).toHaveValue("Centro")
      expect(screen.getByLabelText("Cidade*")).toHaveValue("Joinville")
      expect(screen.getByLabelText("Estado*")).toHaveValue("SC")
    })
  })

  it("deve preencher os campos ao pressionar Enter no campo CEP", async () => {
    mockFetch(mockCepResponse)
    renderComponent()
    fireEvent.change(screen.getByLabelText("CEP*"), { target: { value: "89200000" } })
    fireEvent.keyUp(screen.getByLabelText("CEP*"), { key: "Enter" })
    await waitFor(() => {
      expect(screen.getByLabelText("Endereço*")).toHaveValue("Rua das Flores")
      expect(screen.getByLabelText("Bairro*")).toHaveValue("Centro")
    })
  })

  it("não deve buscar CEP quando CEP tiver menos de 8 dígitos", async () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText("CEP*"), { target: { value: "1234567" } })
    fireEvent.blur(screen.getByLabelText("CEP*"))
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  it("não deve preencher campos quando CEP não for encontrado", async () => {
    mockFetch({ erro: true })
    renderComponent()
    fireEvent.change(screen.getByLabelText("CEP*"), { target: { value: "00000000" } })
    fireEvent.blur(screen.getByLabelText("CEP*"))
    await waitFor(() => {
      expect(screen.getByLabelText("Endereço*")).toHaveValue("")
    })
  })

  it("deve salvar os dados na store e chamar onPageChange(2) ao submeter formulário válido", async () => {
    mockFetch(mockCepResponse)
    const onPageChange = jest.fn()
    renderComponent(onPageChange)

    fireEvent.change(screen.getByLabelText("CEP*"), { target: { value: "89200000" } })
    fireEvent.blur(screen.getByLabelText("CEP*"))

    await waitFor(() => {
      expect(screen.getByLabelText("Endereço*")).toHaveValue("Rua das Flores")
    })

    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))

    await waitFor(() => {
      expect(onPageChange).toHaveBeenCalledWith(2)
      const { addressData } = useAddressDataStore.getState()
      expect(addressData.endereco).toBe("Rua das Flores")
      expect(addressData.cidade).toBe("Joinville")
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