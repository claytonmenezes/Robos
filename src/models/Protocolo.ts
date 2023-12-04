import { ZodError, z } from "zod"

export const Protocolo = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  DocumentoProcesso: z.string().optional(),
  TipoDocumento: z.string().optional(),
  DataDocumento: z.string().optional(),
  DataRegistro: z.string().optional(),
  Unidade: z.string().optional(),
  Link: z.string().optional(),
  DataCriacao: z.date().optional(),
  SeiId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type Protocolo = z.infer<typeof Protocolo>

export const createProtocolo = (protocolo: Protocolo) => {
  try {
    const result = Protocolo.safeParse(protocolo)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}