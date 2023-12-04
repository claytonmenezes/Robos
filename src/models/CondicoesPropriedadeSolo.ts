import { ZodError, z } from "zod"

export const CondicoesPropriedadeSolo = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Tipo: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type CondicoesPropriedadeSolo = z.infer<typeof CondicoesPropriedadeSolo>

export const createCondicoesPropriedadeSolo = (condicoesPropriedadeSolo: CondicoesPropriedadeSolo) => {
  try {
    const result = CondicoesPropriedadeSolo.safeParse(condicoesPropriedadeSolo)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}