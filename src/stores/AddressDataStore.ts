import { create } from "zustand";
import type { AddressDataType } from "@/views/addressData/AddressData.contracts";

type AddressDataStore = {
  addressData: AddressDataType;
  setAddressData: (data: AddressDataType) => void;
}

const useAddressDataStore = create<AddressDataStore>()((set) => ({
  addressData: {
    cep: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: ""
  },
  setAddressData: (data) => set({ addressData: data })
}));

export default useAddressDataStore;