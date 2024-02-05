import { ElementHandle, Page } from 'puppeteer'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import { IServicosIbama } from '../interfaces/IServicosIbama'
import { Ibama, createIbama } from '../models/Ibama'
import axios from 'axios'
import { uuid } from '../services/Utils'
import iconv from 'iconv-lite'

export class ServicosIbama implements IServicosIbama {
  private metodos: IMetodosNavegador
  
  constructor(metodos: IMetodosNavegador) {
    this.metodos = metodos
  }
  async pesquisar (page: Page, cpfCnpj: string): Promise<string> {
    const parametros = new URLSearchParams({
      formDinAcao: 'Consultar',
      num_cpf_cnpj: cpfCnpj
    })
    return axios.post(
      'https://servicos.ibama.gov.br/ctf/publico/certificado_regularidade_consulta.php',
      parametros.toString(),
      { headers:  {'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'arraybuffer' },
    ).then(res => {
      const decodedResponse = iconv.decode(res.data, 'ISO-8859-1')
      return decodedResponse
    })
  }
  async pegaIbama(page: Page, cpfcnpj: string): Promise<Ibama> {
    const html = await this.pesquisar(page, cpfcnpj)
    page.setContent(html)
    let ibama = createIbama({
      Id: uuid(),
      NumeroRegistro: await page.$eval('#num_registro', (input) => (input as HTMLInputElement).value),
      DataConsulta: await page.$eval(`#dat_consulta`, (input) => ((input as HTMLInputElement).value)),
      DataCR: await page.$eval(`#dat_emissao`, (input) => ((input as HTMLInputElement).value)),
      DataValidadeCR: await page.$eval(`#dat_validade`, (input) => ((input as HTMLInputElement).value)),
      CpfCnpj: await page.$eval(`#nom_cnpj`, (input) => ((input as HTMLInputElement).value).replace('-', '').replace('.', '').replace('/', '').replace(' ', '')),
      RazaoSocial: await page.$eval(`#nom_pessoa`, (input) => ((input as HTMLInputElement).value)),
      Descricao: await page.$eval(`#campo_aviso`, (e) => e.textContent || ''),
    })
    return ibama
  }
}
