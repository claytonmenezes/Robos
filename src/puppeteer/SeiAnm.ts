import { IMetodosNavegador } from "../interfaces/IMetodosNavegador"
import { ISeiAnm } from "../interfaces/ISeiAnm"
import { SeiModel } from "../models/SeiModel"

export class SeiAnm implements ISeiAnm {
  private metodos: IMetodosNavegador
  
  constructor(metodos: IMetodosNavegador) {
    this.metodos = metodos
  }
  
  pesquisaSei (nup: string, captcha: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  pegaSei (): Promise<SeiModel> {
    throw new Error("Method not implemented.")
  }
  pegaCaptcha (selector: string, tipo: string): Promise<string> {
    throw new Error("Method not implemented.")
  }
}