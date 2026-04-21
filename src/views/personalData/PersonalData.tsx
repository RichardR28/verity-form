import { CustomInput, MaskedInput, Button } from "@/components"
import { useForm } from "react-hook-form"
import { useCallback, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { PersonalDataType, PersonalDataViewProps } from "./PersonalData.contracts"
import usePersonalDataStore from "@/stores/PersonalDataStore"

const formSchema = z.object({
  nome: z.string().nonempty("Necessário preencher o nome"),
  dataNascimento: z.string().nonempty("Necessário preencher a data de nascimento"),
  cpf: z.string().nonempty("Necessário preencher o CPF").min(1, "Necessário preencher o CPF").length(11, "CPF deve ter 11 dígitos"),
  telefone: z.string().nonempty("Necessário preencher o telefone").min(10, "Telefone deve ter 10 dígitos").max(11, "Telefone deve ter no máximo 11 dígitos"),
  email: z.string().nonempty("Necessário preencher o email").email("E-mail inválido")
});


export default function PersonalData({ onPageChange }: PersonalDataViewProps) {
  const personalDataStore = usePersonalDataStore();
  const { register, handleSubmit, formState: { errors }, control } = useForm<PersonalDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: personalDataStore.personalData,
  });

  const onSubmit = useCallback((data: PersonalDataType) => {
    personalDataStore.setPersonalData(data);
    onPageChange(1);
  }, []);

  return (
    <>
      <h3 className="text-center font-bold">Dados Pessoais</h3>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CustomInput {...register("nome")} error={errors.nome} label="Nome*" placeholder="Informe seu nome completo" />
        <CustomInput {...register("dataNascimento")} error={errors.dataNascimento} label="Data de Nascimento*" type="date" />
        <MaskedInput name="cpf" control={control} format="###.###.###-##" label="CPF*" placeholder="000.000.000-00" error={errors.cpf} allowEmptyFormatting={false} mask="_" />
        <MaskedInput name="telefone" control={control} format="(##) #####-####" label="Telefone*" placeholder="(00) 00000-0000" error={errors.telefone} allowEmptyFormatting={false} mask="" />
        <CustomInput {...register("email")} error={errors.email} label="E-mail*" placeholder="seu.email@exemplo.com" />
        <hr />
        <Button type="submit" label="Continuar" />
      </form>
    </>
  );
};