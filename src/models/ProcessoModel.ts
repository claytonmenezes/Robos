import { PessoaRelacionadaModel } from './PessoaRelacionadaModel'
import { TituloModel } from './TituloModel'
import { SubstanciaModel } from './SubstanciaModel'
import { MunicipioModel } from './MunicipioModel'
import { CondicoesPropriedadeSoloModel } from './CondicoesPropriedadeSoloModel'
import { EventoModel } from './EventoModel'
import { ProcessoAssociadoModel } from './ProcessoAssociadoModel'
import { SeiModel } from './SeiModel'
import { DocumentoProcessoModel } from './DocumentoProcessoModel'

export class ProcessoModel {
  NumeroProcesso?: string
  NUP?: string
  Area?: string
  TipoRequerimento?: string
  FaseAtual?: string
  Ativo?: boolean
  Superintendencia?: string
  UF?: string
  UnidadeProtocolizadora?: string
  DataProtocolo?: string
  DataPrioridade?: string
  NumeroProcessoCadastroEmpresa?: string
  Link?: string
  PessoasRelacionadas?: PessoaRelacionadaModel[]
  Titulos?: TituloModel[]
  Substancias?: SubstanciaModel[]
  Municipios?: MunicipioModel[]
  CondicoesPropriedadeSolo?: CondicoesPropriedadeSoloModel[]
  ProcessosAssociados?: ProcessoAssociadoModel[]
  DocumentosProcesso?: DocumentoProcessoModel[]
  Eventos?: EventoModel[]
  Sei?: SeiModel[]
}
