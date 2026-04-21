import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import PersonalData from "@/views/personalData/PersonalData"
import usePersonalDataStore from "@/stores/PersonalDataStore"

const emptyPersonalData = {
  nome: "",
  dataNascimento: "",
  cpf: "",
  telefone: "",
  email: "",
}

function renderComponent(onPageChange = jest.fn()) {
  return render(<PersonalData onPageChange={onPageChange} />)
}

describe("PersonalData", () => {
  beforeEach(() => {
    usePersonalDataStore.setState({ personalData: emptyPersonalData })
  })

  it("deve renderizar o título corretamente", () => {
    renderComponent()
    expect(screen.getByText("Dados Pessoais")).toBeInTheDocument()
  })

  it("deve renderizar o campo Nome", () => {
    renderComponent()
    expect(screen.getByLabelText("Nome*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Data de Nascimento", () => {
    renderComponent()
    expect(screen.getByLabelText("Data de Nascimento*")).toBeInTheDocument()
  })

  it("deve renderizar o campo CPF", () => {
    renderComponent()
    expect(screen.getByLabelText("CPF*")).toBeInTheDocument()
  })

  it("deve renderizar o campo Telefone", () => {
    renderComponent()
    expect(screen.getByLabelText("Telefone*")).toBeInTheDocument()
  })

  it("deve renderizar o campo E-mail", () => {
    renderComponent()
    expect(screen.getByLabelText("E-mail*")).toBeInTheDocument()
  })

  it("deve renderizar o botão Continuar", () => {
    renderComponent()
    expect(screen.getByRole("button", { name: /continuar/i })).toBeInTheDocument()
  })

  it("deve renderizar o campo Data de Nascimento com type date", () => {
    renderComponent()
    expect(screen.getByLabelText("Data de Nascimento*")).toHaveAttribute("type", "date")
  })

  it("deve preencher os campos com os dados da store", () => {
    usePersonalDataStore.setState({
      personalData: {
        nome: "João Silva",
        dataNascimento: "1990-01-01",
        cpf: "12345678901",
        telefone: "11987654321",
        email: "joao@email.com",
      }
    })
    renderComponent()
    expect(screen.getByLabelText("Nome*")).toHaveValue("João Silva")
    expect(screen.getByLabelText("Data de Nascimento*")).toHaveValue("1990-01-01")
    expect(screen.getByLabelText("E-mail*")).toHaveValue("joao@email.com")
  })

  it("deve exibir erro ao submeter com nome vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o nome")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com data de nascimento vazia", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher a data de nascimento")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com CPF vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o CPF")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com CPF menor que 11 dígitos", async () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText("CPF*"), { target: { value: "1234567890" } })
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("CPF deve ter 11 dígitos")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com telefone vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o telefone")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com telefone menor que 10 dígitos", async () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText("Telefone*"), { target: { value: "119876543" } })
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Telefone deve ter 10 dígitos")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com email vazio", async () => {
    renderComponent()
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("Necessário preencher o email")).toBeInTheDocument()
    })
  })

  it("deve exibir erro ao submeter com email inválido", async () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText("E-mail*"), { target: { value: "emailinvalido" } })
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument()
    })
  })

  it("deve salvar os dados na store e chamar onPageChange(1) ao submeter formulário válido", async () => {
    const onPageChange = jest.fn()
    renderComponent(onPageChange)

    fireEvent.change(screen.getByLabelText("Nome*"), { target: { value: "João Silva" } })
    fireEvent.change(screen.getByLabelText("Data de Nascimento*"), { target: { value: "1990-01-01" } })
    fireEvent.change(screen.getByLabelText("CPF*"), { target: { value: "12345678901" } })
    fireEvent.change(screen.getByLabelText("Telefone*"), { target: { value: "11987654321" } })
    fireEvent.change(screen.getByLabelText("E-mail*"), { target: { value: "joao@email.com" } })
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }))

    await waitFor(() => {
      expect(onPageChange).toHaveBeenCalledWith(1)
      const { personalData } = usePersonalDataStore.getState()
      expect(personalData.nome).toBe("João Silva")
      expect(personalData.email).toBe("joao@email.com")
      expect(personalData.dataNascimento).toBe("1990-01-01")
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