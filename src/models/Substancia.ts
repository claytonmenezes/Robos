import { ZodError, z } from "zod"

export const Substancia = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Nome: z.string().optional(),
  TipoUso: z.string().optional(),
  DataInicio: z.string().optional(),
  DataFinal: z.string().optional(),
  MotivoEncerramento: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type Substancia = z.infer<typeof Substancia>

export const createSubstancia = (substancia: Substancia) => {
  try {
    const result = Substancia.safeParse(substancia)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}