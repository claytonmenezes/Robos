import { ZodError, z } from "zod"

export const Titulo = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Numero: z.string().optional(),
  Descricao: z.string().optional(),
  TipoTitulo: z.string().optional(),
  SituacaoTitulo: z.string().optional(),
  DataPublicacao: z.string().optional(),
  DataVencimento: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type Titulo = z.infer<typeof Titulo>

export const createTitulo = (titulo: Titulo) => {
  try {
    const result = Titulo.safeParse(titulo)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}