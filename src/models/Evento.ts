import { ZodError, z } from "zod"

export const Evento = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Descricao: z.string().optional(),
  Data: z.string().optional(),
  Observacao: z.string().optional(),
  PublicacaoDOU: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type Evento = z.infer<typeof Evento>

export const createEvento = (evento: Evento) => {
  try {
    const result = Evento.safeParse(evento)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}