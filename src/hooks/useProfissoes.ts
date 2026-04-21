import { useState, useEffect } from "react"
const baseURL = "http://localhost:3001";

type Profissao = {
  id: number;
  value: string;
};

export function useProfissoes() {
  const [profissoes, setProfissoes] = useState<Profissao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}/profissoes`)
      .then((res) => res.json())
      .then((data) => setProfissoes(data))
      .catch(() => setError("Erro ao carregar profissões"))
      .finally(() => setLoading(false));
  }, []);

  return { profissoes, loading, error };
}