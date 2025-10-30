export type Point = {
  id: string;
  nome: string;
  categoria: "seguranca" | "educacao" | "saude" | "assistencia" | "internet" | string;
  endereco: string;
  bairro: string;
  lat: number;
  lng: number;
  horario: string;
  fonte?: string;
  verificado: boolean;
  atualizado_em: string;
};