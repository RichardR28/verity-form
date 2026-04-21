import { Button } from "@/components";
import type { SummaryViewProps } from "./Summary.contracts";
import usePersonalDataStore from "@/stores/PersonalDataStore";
import useAddressDataStore from "@/stores/AddressDataStore";
import useProfessionalDataStore from "@/stores/ProfessionalDataStore"
import { useExportPdf } from "@/hooks/useExportPDF"



export default function Summary({ onPageChange }: SummaryViewProps) {
  const { addressData } = useAddressDataStore();
  const { personalData } = usePersonalDataStore();
  const { professionalData } = useProfessionalDataStore();

  const { exportPdf } = useExportPdf();

  function onBack() {
    onPageChange(0);
  }

  function maskDate(date: string) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  function maskCpf(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  function maskPhone(phone: string) {
    return phone.length === 11
      ? phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  function maskCep(cep: string) {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  function maskSalary(value: string) {
    const number = parseFloat(value);
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-center font-bold">Informações</h2>
      <hr />
      <div className="flex flex-col gap-2">
        <h4 className="text-center font-bold">Dados Pessoais</h4>
        <p><strong>Nome:</strong> {personalData.nome}</p>
        <p><strong>Data de Nascimento:</strong> {maskDate(personalData.dataNascimento)}</p>
        <p><strong>CPF:</strong> {maskCpf(personalData.cpf)}</p>
        <p><strong>E-mail:</strong> {personalData.email}</p>
        <p><strong>Telefone:</strong> {maskPhone(personalData.telefone)}</p>
      </div>
      <hr />
      <div className="flex flex-col gap-2">
        <h4 className="text-center font-bold">Endereço</h4>
        <p><strong>CEP:</strong> {maskCep(addressData.cep)}</p>
        <p><strong>Endereço:</strong> {addressData.endereco}</p>
        <p><strong>Bairro:</strong> {addressData.bairro}</p>
        <p><strong>Cidade:</strong> {addressData.cidade}</p>
        <p><strong>Estado:</strong> {addressData.estado}</p>
      </div>
      <hr />
      <div className="flex flex-col gap-2">
        <h4 className="text-center font-bold">Dados Profissionais</h4>
        <p><strong>Empresa:</strong> {professionalData.empresa}</p>
        <p><strong>Profissão:</strong> {professionalData.profissao}</p>
        <p><strong>Salário:</strong> {maskSalary(professionalData.salario)}</p>
        <p><strong>Tempo de Empresa:</strong> {professionalData.tempoEmpresa}</p>
      </div>
      <hr />
      <div className="flex w-full justifi-center items-center gap-4">
        <div className="flex-1">
          <Button label="Corrigir" variant="danger" onClick={onBack} />
        </div>
        <div className="flex-1">
          <Button label="Exportar PDF" onClick={() => exportPdf({
            personalData: {
              ...personalData,
              dataNascimento: maskDate(personalData.dataNascimento),
              cpf: maskCpf(personalData.cpf),
              telefone: maskPhone(personalData.telefone),
            },
            addressData: {
              ...addressData,
              cep: maskCep(addressData.cep),
            },
            professionalData: {
              ...professionalData,
              salario: maskSalary(professionalData.salario),
            },
          })} />
        </div>
      </div>
    </div>
  );
};