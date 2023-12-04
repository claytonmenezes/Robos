import { ZodError, z } from "zod"

export const ProcessoAssociado = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Processo: z.string().optional(),
  Titular: z.string().optional(),
  TipoAssociacao: z.string().optional(),
  DataAssociacao: z.string().optional(),
  DataDesassociacao: z.string().optional(),
  ProcessoOriginal: z.string().optional(),
  Observacao: z.string().optional(),
  Link: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type ProcessoAssociado = z.infer<typeof ProcessoAssociado>

export const createProcessoAssociado = (processoAssociado: ProcessoAssociado) => {
  try {
    const result = ProcessoAssociado.safeParse(processoAssociado)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}