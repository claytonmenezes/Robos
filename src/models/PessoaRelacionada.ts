import { ZodError, z } from "zod"

export const PessoaRelacionada = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  TipoRelacao: z.string().optional(),
  CpfCnpj: z.string().optional(),
  Nome: z.string().optional(),
  ResponsabilidadeRepresentacao: z.string().optional(),
  PrazoArrendamento: z.string().optional(),
  DataInicio: z.string().optional(),
  DataFinal: z.string().optional(),
  DataCriacao: z.date().optional(),
  ProcessoId: z.string().uuid({
    message: 'UUID inválido'
  }).optional()
})

export type PessoaRelacionada = z.infer<typeof PessoaRelacionada>

export const createPessoaRelacionada = (pessoaRelacionada: PessoaRelacionada) => {
  try {
    const result = PessoaRelacionada.safeParse(pessoaRelacionada)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}