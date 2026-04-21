import { CustomInput, CurrencyInput, Button, CustomSelect } from "@/components"
import { useForm } from "react-hook-form"
import { useCallback } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ProfessionalDataType, ProfessionalDataViewProps } from "./ProfessionalData.contracts";
import useProfessionalDataStore from "@/stores/ProfessionalDataStore"
import { useProfissoes } from "@/hooks/useProfissoes"

const schema = z.object({
  empresa: z.string().nonempty("Necessário preencher o nome da empresa"),
  profissao: z.string().nonempty("Necessário preencher a profissão"),
  salario: z.string().nonempty("Necessário preencher o salário"),
  tempoEmpresa: z.string().nonempty("Necessário preencher o tempo de empresa")
});

export default function ProfessionalData({ onPageChange }: ProfessionalDataViewProps) {
  const { profissoes, loading } = useProfissoes();
  const professionalDataStore = useProfessionalDataStore();
  const { register, handleSubmit, formState: { errors }, control } = useForm<ProfessionalDataType>({
    resolver: zodResolver(schema),
    defaultValues: professionalDataStore.professionalData,
  });

  const onSubmit = useCallback((data: ProfessionalDataType) => {
    professionalDataStore.setProfessionalData(data);
    onPageChange(3);
  }, []);

  return (
    <>
      <h3 className="text-center font-bold">Dados Profissionais</h3>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CustomInput {...register("empresa")} error={errors.empresa} label="Empresa*" placeholder="Informe o nome da empresa" />
        <CustomSelect {...register("profissao")} error={errors.profissao} label="Profissão*" placeholder="Informe sua profissão" disabled={loading} options={profissoes} />
        <CurrencyInput
          name="salario"
          control={control}
          label="Salário*"
          placeholder="R$ 0,00"
          error={errors.salario}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          prefix="R$ "
        />
        <CustomInput {...register("tempoEmpresa")} error={errors.tempoEmpresa} label="Tempo de Empresa*" placeholder="Informe o tempo que está na empresa atual" />
        <hr />
        <Button type="submit" label="Continuar" />
      </form>
    </>
  );
};