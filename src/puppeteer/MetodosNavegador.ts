import puppeteer, { Browser, Page } from 'puppeteer'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import { base64ToCaptchaProcesso } from '../services/Utils'

export class MetodosNavegador implements IMetodosNavegador {
  async abrirBrowser(): Promise<Browser> {
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === 'dev' ? false : 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    return browser
  }
  async fecharBrowser(browser: Browser): Promise<void> {
    await browser.close()
  }
  async fecharAba(page: Page): Promise<void> {
    await page.close()
  }
  async navegar(browser: Browser, url: string): Promise<Page> {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.goto(url, { timeout: 0 })
    return page
  }
  async pegaTextoElemento(page: Page, selector: string): Promise<string> {
    return await page.$eval(selector, (e) => e.innerHTML)
  }
  async esperaElementoExistir(page: Page, selector: string): Promise<void> {
    if (!await this.verificaElementoVisivel(page, selector)) {
      await this.esperaElementoExistir(page, selector)
    }
  }
  async esperaElementoSumir(page: Page, selector: string): Promise<void> {
    if (await this.verificaElementoVisivel(page, selector)) {
      await this.esperaElementoSumir(page, selector)
    }
  }
  async verificaElementoVisivel(page: Page, selector: string): Promise<Boolean> {
    try {
      const element = await page.$(selector)
      const isVisibleHandle = await page.evaluateHandle((e) => {
        if (!e) return false
        const style = window.getComputedStyle(e)
        return (style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0')
      }, element)
      var visible = await isVisibleHandle.jsonValue()
      const box = await element?.boxModel()
      if (visible && box) {
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
  async pegaCaptcha (page: Page, selector: string): Promise<string> {
    const el = await page.$(selector)
    const base64 = await el?.screenshot({ encoding: 'base64' })
    const captcha = await base64ToCaptchaProcesso(base64 as string) as string
    return captcha
  }
}