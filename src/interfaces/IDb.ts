import { Processo } from "../models/Processo"
import { CondicoesPropriedadeSolo } from "../models/CondicoesPropriedadeSolo"
import { DocumentoProcesso } from "../models/DocumentoProcesso"
import { Evento } from "../models/Evento"
import { Municipio } from "../models/Municipio"
import { PessoaRelacionada } from "../models/PessoaRelacionada"
import { ProcessoAssociado } from "../models/ProcessoAssociado"
import { Titulo } from "../models/Titulo"
import { Substancia } from "../models/Substancia"
import { Sei } from "../models/Sei"
import { Protocolo } from "../models/Protocolo"
import { Andamento } from "../models/Andamento"
import { Ibama } from "../models/Ibama"
import { Client } from "pg"

export interface IDb {
  conectar (): Promise<Client>
  desconectar (client: Client): Promise<void>
  insereProcesso (client: Client, processo: Processo, processoId?: string): Promise<Processo>
  insereCondicoesPropriedadeSolo (client: Client, condicoesPropriedadeSolo: CondicoesPropriedadeSolo[], processoId: string): Promise<CondicoesPropriedadeSolo[]>
  insereDocumentosProcesso (client: Client, documentosProcesso: DocumentoProcesso[], processoId: string): Promise<DocumentoProcesso[]>
  insereEventos (client: Client, eventos: Evento[], processoId: string): Promise<Evento[]>
  insereMunicipios (client: Client, municipios: Municipio[], processoId: string): Promise<Municipio[]>
  inserePessoasRelacionadas (client: Client, pessoasRelacionadas: PessoaRelacionada[], processoId: string): Promise<PessoaRelacionada[]>
  insereProcessosAssociados (client: Client, processosAssociados: ProcessoAssociado[], processoId: string): Promise<ProcessoAssociado[]>
  insereTitulos (client: Client, titulos: Titulo[], processoId: string): Promise<Titulo[]>
  insereSubstancias (client: Client, substancias: Substancia[], processoId: string): Promise<Substancia[]>
  insereSei (client: Client, sei: Sei, processoId: string): Promise<Sei>
  insereProtocolos (client: Client, protocolos: Protocolo[], seiId: string): Promise<Protocolo[]>
  insereAndamentos (client: Client, andamentos: Andamento[], seiId: string): Promise<Andamento[]>
  buscaProcesso (client: Client, numeroProcesso: string): Promise<Processo | void>
  buscaProcessoPorNup (client: Client, nup: string): Promise<Processo | null>
  buscarCondicoesPropriedadeSoloPorProcesso(client: Client, processoId: string): Promise<CondicoesPropriedadeSolo[] | null>
  buscarDocumentosProcessoPorProcesso(client: Client, processoId: string): Promise<DocumentoProcesso[] | null>
  buscarEventosPorProcesso(client: Client, processoId: string): Promise<Evento[] | null>
  buscarMunicipiosPorProcesso(client: Client, processoId: string): Promise<Municipio[] | null>
  buscarPessoasRelacionadasPorProcesso(client: Client, processoId: string): Promise<PessoaRelacionada[] | null>
  buscarProcessosAssociadosPorProcesso(client: Client, processoId: string): Promise<ProcessoAssociado[] | null>
  buscarSubstanciasPorProcesso(client: Client, processoId: string): Promise<Substancia[] | null>
  buscarTitulosPorProcesso(client: Client, processoId: string): Promise<Titulo[] | null>
  buscaSei (client: Client, nup: string): Promise<Sei | null>
  deletaProcesso (client: Client, processoId: string): Promise<void>
  deletaSei (client: Client, seiId: string): Promise<void>
  verificaProcessoExiste (client: Client, numeroProcesso: string): Promise<boolean>
  filtrar (client: Client, filtro: string): Promise<Array<Processo> | null>,
  buscaIbama (client: Client, cpfcnpj: string): Promise<Ibama | null>
  insereIbama (client: Client, ibama: Ibama, ibamaId?: string): Promise<Ibama>
  deletaIbama (client: Client, ibamaId: string): Promise<void>
}