import { Page } from 'puppeteer'
import { Sei } from '../models/Sei'
import { Protocolo } from '../models/Protocolo'
import { Andamento } from '../models/Andamento'

export interface ISeiAnm {
  pesquisaSei (page: Page, nup: string): Promise<boolean>
  pegaSei (page: Page ): Promise<Sei>
  pegaProtocolos (page: Page): Promise<Protocolo[]>
  pegaAndamentos (page: Page): Promise<Andamento[]>
}