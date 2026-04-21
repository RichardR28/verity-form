import { create } from "zustand"
import type { PersonalDataType } from "@/views/personalData/PersonalData.contracts"

type PersonalDataStore = {
  personalData: PersonalDataType;
  setPersonalData: (data: PersonalDataType) => void;
}

const usePersonalDataStore = create<PersonalDataStore>()((set) => ({
  personalData: {
    nome: "",
    dataNascimento: "",
    cpf: "",
    telefone: "",
    email: ""
  },

  setPersonalData: (data) => set({ personalData: data }),
}));

export default usePersonalDataStore;