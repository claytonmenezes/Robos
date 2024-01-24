import { Page } from 'puppeteer'
import { Ibama } from '../models/Ibama'

export interface IServicosIbama {
  pesquisar(page: Page, cpfCnpj: string): Promise<void>
  pegaIbama (page: Page, cpfcnpj: string): Promise<Ibama>
}