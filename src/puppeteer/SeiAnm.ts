import { Page } from "puppeteer"
import { IMetodosNavegador } from "../interfaces/IMetodosNavegador"
import { ISeiAnm } from "../interfaces/ISeiAnm"
import { Sei, createSei } from "../models/Sei"
import { Protocolo, createProtocolo } from "../models/Protocolo"
import { Andamento, createAndamento } from "../models/Andamento"
import { esperar, captchaManual } from "../services/Utils"

export class SeiAnm implements ISeiAnm {
  private metodos: IMetodosNavegador
  
  constructor(metodos: IMetodosNavegador) {
    this.metodos = metodos
  }
  async pesquisaSei(page: Page, nup: string): Promise<boolean> {
    let captcha = ''
    if (process.env.NODE_ENV === 'dev') {
      captcha = await captchaManual()
    } else {
      captcha = await this.metodos.pegaCaptcha(page, '#lblCaptcha > img', 'Sei')
    }
    console.log('pesquisaSei', nup, captcha)
    const input = await page.$('#txtProtocoloPesquisa')
    await input?.click({ clickCount: 3 })
    await input?.type('')
    await input?.type(nup)
    await page.type('#txtCaptcha', captcha)
    await page.click('#sbmPesquisar')

    await esperar(1000)
    if ((await page.$eval('#conteudo > div', (e) => e.className)) === 'sem-resultado') return false
    if (!(await this.metodos.verificaElementoVisivel(page, '#conteudo'))) return await this.pesquisaSei(page, nup)
    return true
  }
  async pegaSei(page: Page): Promise<Sei> {
    const sei = createSei({
      Processo: (await page.$eval('#tblCabecalho > tbody > tr:nth-child(2) > td:nth-child(2)', (e) => e.innerHTML)).replace('.', '').replace('/', '').replace('-', ''),
      Tipo: await page.$eval('#tblCabecalho > tbody > tr:nth-child(3) > td:nth-child(2)', (e) => e.innerHTML),
      DataRegistro: await page.$eval('#tblCabecalho > tbody > tr:nth-child(4) > td:nth-child(2)', (e) => e.innerHTML),
      Interessados: await page.$eval('#tblCabecalho > tbody > tr:nth-child(5) > td:nth-child(2)', (e) => e.innerHTML),
      Link: page.url(),
      Protocolos: await this.pegaProtocolos(page),
      Andamentos: await this.pegaAndamentos(page)
    })
    return sei
  }
  async pegaProtocolos(page: Page): Promise<Protocolo[]> {
    const protocolos: Protocolo[] = []
    const elTrs = await page.$$('#tblDocumentos > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let protocolo = createProtocolo({
        DocumentoProcesso: await elTr.$eval(`#tblDocumentos > tbody > tr:nth-child(${index}) > td:nth-child(2)`, (e) => (e.outerText)),
        TipoDocumento: await elTr.$eval(`#tblDocumentos > tbody > tr:nth-child(${index}) > td:nth-child(3)`, (e) => (e.outerText)),
        DataDocumento: await elTr.$eval(`#tblDocumentos > tbody > tr:nth-child(${index}) > td:nth-child(4)`, (e) => (e.outerText)),
        DataRegistro: await elTr.$eval(`#tblDocumentos > tbody > tr:nth-child(${index}) > td:nth-child(5)`, (e) => (e.outerText)),
        Unidade: await elTr.$eval(`#tblDocumentos > tbody > tr:nth-child(${index}) > td:nth-child(6)`, (e) => (e.outerText)),
        DataCriacao: new Date(),
      })
      const link = await elTr.evaluate((e) => e.innerHTML.substring(e.innerHTML.indexOf('window.open(') + 'window.open('.length + 1, e.innerHTML.lastIndexOf(');"') - 1))
      if (link !== '<td>&nbsp;</') {
        const baseUrl = await elTr.evaluate((e) => e.baseURI.substring(0, e.baseURI.lastIndexOf('/') + 1))
        protocolo.Link = baseUrl + link
      }
      else {
        protocolo.Link = ''
      }
      protocolos.push(protocolo)
    }
    return protocolos
  }
  async pegaAndamentos(page: Page): Promise<Andamento[]> {
    const andamentos: Andamento[] = []
    const elTrs = await page.$$('#tblHistorico > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let andamento = createAndamento({
        DataHora: await elTr.$eval(`#tblHistorico > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        Unidade: await elTr.$eval(`#tblHistorico > tbody > tr:nth-child(${index}) > td:nth-child(2)`, (e) => (e.outerText)),
        Descricao: await elTr.$eval(`#tblHistorico > tbody > tr:nth-child(${index}) > td:nth-child(3)`, (e) => (e.outerText)),
        DataCriacao: new Date(),
      })
      andamentos.push(andamento)
    }
    return andamentos
  }
}