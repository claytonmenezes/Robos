import {IDb} from '../interfaces/IDb'
import { ProcessoModel } from '../models/ProcessoModel'
import { SeiModel } from '../models/SeiModel'

export class Db implements IDb {
  async insereProcesso(processoModel: ProcessoModel): Promise<ProcessoModel> {
    throw new Error('Method not implemented.')
  }
  async insereSei(seiModel: SeiModel, processoId: string): Promise<SeiModel> {
    throw new Error('Method not implemented.')
  }
  async buscaProcesso(numeroProcesso: string): Promise<ProcessoModel> {
    throw new Error('Method not implemented.')
  }
  async buscaProcessoPorNup(nup: string): Promise<ProcessoModel> {
    throw new Error('Method not implemented.')
  }
  async buscaSei(nup: string): Promise<SeiModel> {
    throw new Error('Method not implemented.')
  }
  async deletaDependenciasProcesso(processoId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async deletaDependenciasSei(seiId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}