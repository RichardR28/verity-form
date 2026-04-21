import { create } from "zustand";
import type { ProfessionalDataType } from "@/views/professionalData/ProfessionalData.contracts";

type ProfessionalDataStore = {
  professionalData: ProfessionalDataType;
  setProfessionalData: (data: ProfessionalDataType) => void;
}

const useProfessionalDataStore = create<ProfessionalDataStore>()((set) => ({
  professionalData: {
    empresa: "",
    profissao: "",
    salario: "",
    tempoEmpresa: ""
  },

  setProfessionalData: (data) => set({ professionalData: data })
}))

export default useProfessionalDataStore;