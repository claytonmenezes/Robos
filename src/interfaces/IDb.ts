import { ProcessoModel } from "../models/ProcessoModel"
import { CondicoesPropriedadeSoloModel } from "../models/CondicoesPropriedadeSoloModel"
import { DocumentoProcessoModel } from "../models/DocumentoProcessoModel"
import { EventoModel } from "../models/EventoModel"
import { MunicipioModel } from "../models/MunicipioModel"
import { PessoaRelacionadaModel } from "../models/PessoaRelacionadaModel"
import { ProcessoAssociadoModel } from "../models/ProcessoAssociadoModel"
import { TituloModel } from "../models/TituloModel"
import { SubstanciaModel } from "../models/SubstanciaModel"
import { SeiModel } from "../models/SeiModel"
import { ProtocoloModel } from "../models/ProtocoloModel"
import { AndamentoModel } from "../models/AndamentoModel"
import { Client } from "pg"

export interface IDb {
  conectar (): Promise<Client>
  desconectar (client: Client): Promise<void>
  insereProcesso (client: Client, processo: ProcessoModel): Promise<ProcessoModel>
  insereCondicoesPropriedadeSolo (client: Client, condicoesPropriedadeSolo: CondicoesPropriedadeSoloModel[], processoId: string): Promise<CondicoesPropriedadeSoloModel[]>
  insereDocumentosProcesso (client: Client, documentosProcesso: DocumentoProcessoModel[], processoId: string): Promise<DocumentoProcessoModel[]>
  insereEventos (client: Client, eventos: EventoModel[], processoId: string): Promise<EventoModel[]>
  insereMunicipios (client: Client, municipios: MunicipioModel[], processoId: string): Promise<MunicipioModel[]>
  inserePessoasRelacionadas (client: Client, pessoasRelacionadas: PessoaRelacionadaModel[], processoId: string): Promise<PessoaRelacionadaModel[]>
  insereProcessosAssociados (client: Client, processosAssociados: ProcessoAssociadoModel[], processoId: string): Promise<ProcessoAssociadoModel[]>
  insereTitulos (client: Client, titulos: TituloModel[], processoId: string): Promise<TituloModel[]>
  insereSubstancias (client: Client, substancias: SubstanciaModel[], processoId: string): Promise<SubstanciaModel[]>
  insereSei (client: Client, sei: SeiModel, processoId: string): Promise<SeiModel>
  insereProtocolos (client: Client, protocolos: ProtocoloModel[], seiId: string): Promise<ProtocoloModel[]>
  insereAndamentos (client: Client, andamentos: AndamentoModel[], seiId: string): Promise<AndamentoModel[]>
  buscaProcesso (client: Client, numeroProcesso: string): Promise<ProcessoModel> | Promise<null>
  buscaProcessoPorNup (client: Client, nup: string): Promise<ProcessoModel> | Promise<null>
  buscaSei (client: Client, nup: string): Promise<SeiModel> | Promise<null>
  deletaProcesso (client: Client, processoId: string): Promise<void>
  deletaSei (client: Client, seiId: string): Promise<void>
}