import { Page } from "puppeteer"
import { IMetodosNavegador } from "../interfaces/IMetodosNavegador"
import { ISeiAnm } from "../interfaces/ISeiAnm"
import { Sei } from "../models/Sei"

export class SeiAnm implements ISeiAnm {
  private metodos: IMetodosNavegador
  
  constructor(metodos: IMetodosNavegador) {
    this.metodos = metodos
  }
  pesquisaSei(page: Page, up: string, captcha: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  pegaSei(page: Page): Promise<{ Id?: string | undefined; Processo?: string | undefined; Tipo?: string | undefined; DataRegistro?: string | undefined; Interessados?: string | undefined; Link?: string | undefined; DataCriacao?: Date | undefined; ProcessoId?: string | undefined; Protocolos?: { Id?: string | undefined; DocumentoProcesso?: string | undefined; TipoDocumento?: string | undefined; DataDocumento?: string | undefined; DataRegistro?: string | undefined; Unidade?: string | undefined; Link?: string | undefined; DataCriacao?: Date | undefined; SeiId?: string | undefined }[] | undefined; Andamentos?: { Id?: string | undefined; DataHora?: string | undefined; Unidade?: string | undefined; Descricao?: string | undefined; DataCriacao?: Date | undefined; SeiId?: string | undefined }[] | undefined }> {
    throw new Error("Method not implemented.")
  }
  pegaCaptcha(page: Page, selector: string, tipo: string): Promise<string> {
    throw new Error("Method not implemented.")
  }
}