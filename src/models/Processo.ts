import { PessoaRelacionada } from './PessoaRelacionada'
import { Titulo } from './Titulo'
import { Substancia } from './Substancia'
import { Municipio } from './Municipio'
import { CondicoesPropriedadeSolo } from './CondicoesPropriedadeSolo'
import { Evento } from './Evento'
import { ProcessoAssociado } from './ProcessoAssociado'
import { Sei } from './Sei'
import { DocumentoProcesso } from './DocumentoProcesso'
import { ZodError, z } from "zod"

export const Processo = z.object({
  Id: z.string().uuid({
    message: 'UUID inválido'
  }).optional(),
  NumeroProcesso: z.string().optional(),
  NUP: z.string().optional(),
  Area: z.string().optional(),
  TipoRequerimento: z.string().optional(),
  FaseAtual: z.string().optional(),
  Ativo: z.boolean().optional(),
  Superintendencia: z.string().optional(),
  UF: z.string().optional(),
  UnidadeProtocolizadora: z.string().optional(),
  DataProtocolo: z.string().optional(),
  DataPrioridade: z.string().optional(),
  NumeroProcessoCadastroEmpresa: z.string().optional(),
  Link: z.string().optional(),
  DataCriacao: z.date().optional(),
  PessoasRelacionadas: z.array(PessoaRelacionada).optional(),
  Titulos: z.array(Titulo).optional(),
  Substancias: z.array(Substancia).optional(),
  Municipios: z.array(Municipio).optional(),
  CondicoesPropriedadeSolo: z.array(CondicoesPropriedadeSolo).optional(),
  ProcessosAssociados: z.array(ProcessoAssociado).optional(),
  DocumentosProcesso: z.array(DocumentoProcesso).optional(),
  Eventos: z.array(Evento).optional(),
  Sei: Sei.optional()
})

export type Processo = z.infer<typeof Processo>

export const createProcesso = (processo: Processo) => {
  try {
    const result = Processo.safeParse(processo)
    if (result.success) return result.data
    throw result.error
  } catch (error) {
    if (error instanceof ZodError) throw error.issues[0].message
    throw error
  }
}