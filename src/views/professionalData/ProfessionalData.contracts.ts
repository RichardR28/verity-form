export type ProfessionalDataType = {
  empresa: string,
  profissao: string,
  salario: string,
  tempoEmpresa: string
}

export type ProfessionalDataViewProps = {
  onPageChange: (page: number) => void;
};