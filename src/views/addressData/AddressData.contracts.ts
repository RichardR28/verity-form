export type AddressDataType = {
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type AddressDataViewProps = {
  onPageChange: (page: number) => void;
};