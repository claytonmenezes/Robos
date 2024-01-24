import { ElementHandle, Page } from 'puppeteer'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import { IServicosIbama } from '../interfaces/IServicosIbama'
import { esperar } from '../services/Utils'
import { Ibama } from '../models/Ibama'

export class ServicosIbama implements IServicosIbama {
  private metodos: IMetodosNavegador
  
  constructor(metodos: IMetodosNavegador) {
    this.metodos = metodos
  }
  async pesquisar (page: Page, cpfCnpj: string): Promise<void> {
    const input = await page.$('#num_cpf_cnpj') as ElementHandle<Element>
    await page.type('#num_cpf_cnpj', cpfCnpj)
    await page.click('#btnPesquisa')
    await esperar(1000)
    if (await this.metodos.verificaElementoVisivel(page, '#num_registro')) await this.pesquisar(page, cpfCnpj)
    else if (await this.metodos.verificaElementoVisivel(page, '#divFormDinMsgRodapeErros > blink')) throw new Error('Número Cpf/Cnpj inválido')
    await esperar(100000)
  }
  async pegaIbama(page: Page, cpfcnpj: string): Promise<Ibama> {
    await this.pesquisar(page, cpfcnpj)
    throw new Error('Method not implemented.')
  }
}
