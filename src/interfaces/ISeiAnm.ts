import { Page } from 'puppeteer'
import { Sei } from '../models/Sei'

export interface ISeiAnm {
  pesquisaSei (page: Page, up: string, captcha: string): Promise<void>
  pegaSei (page: Page ): Promise<Sei> 
  pegaCaptcha (page: Page, selector: string, tipo: string): Promise<string>
}