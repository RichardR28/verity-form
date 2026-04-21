export type PersonalDataType = {
  nome: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  email: string;
};

export type PersonalDataViewProps = {
  onPageChange: (page: number) => void;
};
