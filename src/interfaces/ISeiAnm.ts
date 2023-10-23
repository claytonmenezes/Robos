import { SeiModel } from "../models/SeiModel"

export interface ISeiAnm {
  pesquisaSei (nup: string, captcha: string): Promise<void>
  pegaSei (): Promise<SeiModel> 
  pegaCaptcha (selector: string, tipo: string): Promise<string>
}