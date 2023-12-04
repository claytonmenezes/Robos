import { ZodError, z } from "zod"

export const Municipio = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Nome: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type Municipio = z.infer<typeof Municipio>

export const createMunicipio = (municipio: Municipio) => {
  try {
    const result = Municipio.safeParse(municipio)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}