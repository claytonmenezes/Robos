import { Andamento } from "./Andamento"
import { Protocolo } from "./Protocolo"
import { ZodError, z } from "zod"

export const Sei = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Processo: z.string().optional(),
  Tipo: z.string().optional(),
  DataRegistro: z.string().optional(),
  Interessados: z.string().optional(),
  Link: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Protocolos: z.array(Protocolo).optional(),
  Andamentos: z.array(Andamento).optional()
})

export type Sei = z.infer<typeof Sei>

export const createSei = (sei: Sei) => {
  try {
    const result = Sei.safeParse(sei)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}