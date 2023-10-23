import { ProcessoModel } from "../models/ProcessoModel"

export interface ISistemasAnm {
  pesquisaProcesso (numeroProcesso: string, captcha: string): Promise<void>
  pegaProcesso (numeroProcesso: string): Promise<ProcessoModel>
  pegaCaptcha (selector: string, tipo: string): Promise<string>
}