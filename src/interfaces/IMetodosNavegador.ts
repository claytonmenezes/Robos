import { Page, Browser } from 'puppeteer'

export interface IMetodosNavegador {
  abrirBrowser (): Promise<Browser>
  fecharBrowser (browser: Browser): Promise<void>
  navegar (browser: Browser, url: string): Promise<Page>
  pegaTextoElemento (page: Page, selector: string): Promise<string>
  esperaElementoExistir (page: Page, selector: string): Promise<void>
  esperaElementoSumir (page: Page, selector: string): Promise<void>
  verificaElementoVisivel (page: Page, selector: string): Promise<Boolean>
}