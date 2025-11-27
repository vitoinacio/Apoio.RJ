import { z } from "zod";


export const SuggestionSchema = z.object({
nome: z.string().min(3).max(140),
categoria: z.enum(["seguranca","educacao","saude","assistencia","internet"]).optional().default("assistencia"),
endereco: z.string().min(3).max(200),
bairro: z.string().min(1).max(100).optional().default(""),
lat: z.number().gte(-90).lte(90),
lng: z.number().gte(-180).lte(180),
horario: z.string().max(140).optional().default(""),
telefone: z.string().max(40).optional().default(""),
observacoes: z.string().max(500).optional().default(""),
});


export type SuggestionInput = z.infer<typeof SuggestionSchema>;