import { useCallback } from "react"
import jsPDF from "jspdf"
import Logo from "@/assets/logoVRT.png"


type ReportData = {
  personalData: { nome: string; dataNascimento: string; cpf: string; email: string; telefone: string };
  addressData: { cep: string; endereco: string; bairro: string; cidade: string; estado: string };
  professionalData: { empresa: string; profissao: string; salario: string; tempoEmpresa: string };
}

const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = url;
  });
};

export function useExportPdf() {
  const exportPdf = useCallback(async (data: ReportData) => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const margin = 20;
    const pageWidth = 170;
    let y = 25;

    const logoBase64 = await loadImageAsBase64(Logo);
    pdf.addImage(logoBase64, "PNG", margin, 8, 30, 10);

    const addTitle = (text: string) => {
      y += 4;
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text(text, 105, y, { align: "center" });
      y += 9;
    };

    const addField = (label: string, value: string) => {
      pdf.setFontSize(10);

      // Label em bold
      pdf.setFont("helvetica", "bold");
      pdf.text(`${label}: `, margin, y);

      // Calcula onde o label termina
      const labelWidth = pdf.getTextWidth(`${label}: `); // 👈 getTextWidth retorna mm direto

      // Valor em normal logo após o label
      pdf.setFont("helvetica", "normal");
      pdf.text(value, margin + labelWidth, y); // 👈 valor posicionado após o label

      y += 7;
    };

    const addDivider = () => {
      y += 2;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, y, margin + pageWidth, y);
      y += 6;
    };

    // Cabeçalho
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Informações", 105, y, { align: "center" });
    y += 6;
    addDivider();

    // Dados Pessoais
    addTitle("Dados Pessoais");
    addField("Nome", data.personalData.nome);
    addField("Data de Nascimento", data.personalData.dataNascimento);
    addField("CPF", data.personalData.cpf);
    addField("E-mail", data.personalData.email);
    addField("Telefone", data.personalData.telefone);
    addDivider();

    // Endereço
    addTitle("Endereço");
    addField("CEP", data.addressData.cep);
    addField("Endereço", data.addressData.endereco);
    addField("Bairro", data.addressData.bairro);
    addField("Cidade", data.addressData.cidade);
    addField("Estado", data.addressData.estado);
    addDivider();

    // Dados Profissionais
    addTitle("Dados Profissionais");
    addField("Empresa", data.professionalData.empresa);
    addField("Profissão", data.professionalData.profissao);
    addField("Salário", data.professionalData.salario);
    addField("Tempo de Empresa", data.professionalData.tempoEmpresa);

    pdf.save("relatorio_verity.pdf");
  }, []);

  return { exportPdf };
}