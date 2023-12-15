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
import { Client } from "pg"

export interface IDb {
  conectar (): Promise<Client>
  desconectar (client: Client): Promise<void>
  insereProcesso (client: Client, processo: Processo): Promise<Processo>
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
  buscaProcessoPorNup (client: Client, nup: string): Promise<Processo> | Promise<null>
  buscarCondicoesPropriedadeSoloPorProcesso(client: Client, processoId: string): Promise<CondicoesPropriedadeSolo[]> | Promise<null>
  buscarDocumentosProcessoPorProcesso(client: Client, processoId: string): Promise<DocumentoProcesso[]> | Promise<null>
  buscarEventosPorProcesso(client: Client, processoId: string): Promise<Evento[]> | Promise<null>
  buscarMunicipiosPorProcesso(client: Client, processoId: string): Promise<Municipio[]> | Promise<null>
  buscarPessoasRelacionadasPorProcesso(client: Client, processoId: string): Promise<PessoaRelacionada[]> | Promise<null>
  buscarProcessosAssociadosPorProcesso(client: Client, processoId: string): Promise<ProcessoAssociado[]> | Promise<null>
  buscarSubstanciasPorProcesso(client: Client, processoId: string): Promise<Substancia[]> | Promise<null>
  buscarTitulosPorProcesso(client: Client, processoId: string): Promise<Titulo[]> | Promise<null>
  buscaSei (client: Client, nup: string): Promise<Sei> | Promise<null>
  deletaProcesso (client: Client, processoId: string): Promise<void>
  deletaSei (client: Client, seiId: string): Promise<void>
}