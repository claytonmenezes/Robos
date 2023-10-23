import { ProcessoModel } from "../models/ProcessoModel"
import { SeiModel } from "../models/SeiModel"

export interface IDb {
  insereProcesso (processoModel: ProcessoModel): Promise<ProcessoModel>
  insereSei (seiModel: SeiModel, processoId: string): Promise<SeiModel>
  buscaProcesso (numeroProcesso: string): Promise<ProcessoModel> | Promise<null>
  buscaProcessoPorNup (nup: string): Promise<ProcessoModel> | Promise<null>
  buscaSei (nup: string): Promise<SeiModel> | Promise<null>
  deletaDependenciasProcesso (processoId: string): Promise<void>
  deletaDependenciasSei (seiId: string): Promise<void>
}