import { ZodError, z } from "zod"

export const DocumentoProcesso = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  Documento: z.string().optional(),
  DataProtocolo: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type DocumentoProcesso = z.infer<typeof DocumentoProcesso>

export const createDocumentoProcesso = (documentoProcesso: DocumentoProcesso) => {
  try {
    const result = DocumentoProcesso.safeParse(documentoProcesso)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}