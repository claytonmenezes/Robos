import { ZodError, z } from "zod"

export const Andamento = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  DataHora: z.string().optional(),
  Unidade: z.string().optional(),
  Descricao: z.string().optional(),
  DataCriacao: z.date().optional(),
  SeiId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type Andamento = z.infer<typeof Andamento>

export const createAndamento = (andamento: Andamento) => {
  try {
    const result = Andamento.safeParse(andamento)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}