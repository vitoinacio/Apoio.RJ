export type Categoria =
  | "seguranca"
  | "educacao"
  | "saude"
  | "assistencia"
  | "internet";

export type SuggestDefaults = {
  nome?: string;
  categoria?: Categoria;
  endereco?: string;
  bairro?: string;
  lat: number;
  lng: number;
  horario?: string;
};

export interface FormState {
  nome: string;
  categoria: Categoria;
  endereco: string;
  bairro: string;
  lat: number;
  lng: number;
  horario: string;
  telefone: string;
  observacoes: string;
}

export type ApiError = { error?: string };

export type SuggestionStatus = "pendente" | "aprovado" | "rejeitado";

export type Suggestion = {
  id: number;
  nome: string;
  categoria: Categoria | null;
  endereco: string;
  bairro: string | null;
  lat: number;
  lng: number;
  horario: string | null;
  telefone: string | null;
  observacoes: string | null;
  status: SuggestionStatus;
  created_at: string;
};

export type SuggestionsResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: Suggestion[];
};
