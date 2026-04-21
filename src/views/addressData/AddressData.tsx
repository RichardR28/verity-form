import { CustomInput, MaskedInput, Button } from "@/components"
import { useForm } from "react-hook-form"
import { useCallback } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { AddressDataType, AddressDataViewProps } from "./AddressData.contracts"
import useAddressDataStore from "@/stores/AddressDataStore"
import { useCep } from "@/hooks/useCep"

const formSchema = z.object({
  cep: z.string().nonempty("Necessário preencher o CEP").length(8, "CEP deve ter 8 dígitos"),
  endereco: z.string().nonempty("Necessário preencher o endereço"),
  bairro: z.string().nonempty("Necessário preencher o bairro"),
  cidade: z.string().nonempty("Necessário preencher a cidade"),
  estado: z.string().nonempty("Necessário preencher o estado").length(2, "Estado deve ter 2 caracteres"),
});

export default function AddressData({ onPageChange }: AddressDataViewProps) {
  const { fetchCep, loading } = useCep();
  const addressDataStore = useAddressDataStore();
  const { register, handleSubmit, formState: { errors }, control, setValue, getValues } = useForm<AddressDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: addressDataStore.addressData,
  });

  const onSubmit = useCallback((data: AddressDataType) => {
    addressDataStore.setAddressData(data);
    onPageChange(2);
  }, []);

  const handleCepChange = useCallback(async () => {
    const cep = getValues("cep");
    const data = await fetchCep(cep);
    if (data) {
      setValue("endereco", data.logradouro);
      setValue("bairro", data.bairro);
      setValue("cidade", data.localidade);
      setValue("estado", data.uf);
    }
  }, [fetchCep, setValue]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const cep = getValues("cep");
    if (event.key === "Enter") {
      event.preventDefault();
      handleCepChange();
    } else {
      if (cep.length === 8) {
        handleCepChange();
      }
    }
  };

  return (
    <>
      <h3 className="text-center font-bold">Endereço</h3>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <MaskedInput name="cep" control={control} format="#####-###" label="CEP*" placeholder="00000-000" error={errors.cep} allowEmptyFormatting={false} mask="_" onBlur={handleCepChange} onKeyUp={handleKeyDown} />
        <CustomInput {...register("endereco")} error={errors.endereco} label="Endereço*" placeholder="Informe seu endereço completo" disabled={loading} />
        <CustomInput {...register("bairro")} error={errors.bairro} label="Bairro*" placeholder="Informe seu bairro" disabled={loading} />
        <CustomInput {...register("cidade")} error={errors.cidade} label="Cidade*" placeholder="Informe sua cidade" disabled={loading} />
        <CustomInput {...register("estado")} error={errors.estado} label="Estado*" placeholder="Informe seu estado (UF)" disabled={loading} />
        <hr />
        <Button type="submit" label="Continuar" />
      </form>
    </>
  );
};