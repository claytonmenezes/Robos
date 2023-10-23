import puppeteer from 'puppeteer'
import { IMetodosNavegador } from "../interfaces/IMetodosNavegador"
import { ISistemasAnm } from "../interfaces/ISistemasAnm"
import { ProcessoModel } from "../models/ProcessoModel"

export class SistemasAnm implements ISistemasAnm {
  private metodos: IMetodosNavegador
  
  constructor(metodos: IMetodosNavegador) {
    this.metodos = metodos
  }
  
  async pegaProcesso (numeroProcesso: string): Promise<ProcessoModel> {
    try {
      await this.metodos.abrePagina('https://sistemas.anm.gov.br/SCM/site/admin/dadosProcesso.aspx')
      const captcha = await this.pegaCaptcha('#ctl00_conteudo_trCaptcha > td:nth-child(2) > div:nth-child(1) > span:nth-child(1) > img', 'Processo')
      await this.pesquisaProcesso(numeroProcesso, captcha)
      const processo = {
        NumeroProcesso: await this.metodos.pegaTextoElemento('#ctl00_conteudo_txtNumeroProcesso'),
        NUP: (await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblNup')).replace('.', '').replace('/', '').replace('-', ''),
        Area: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblArea'),
        TipoRequerimento: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblTipoRequerimento'),
        FaseAtual: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblTipoFase'),
        Ativo: (await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblAtivo')) === 'Sim' ? true : false,
        Superintendencia: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblDistrito'),
        UF: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblUF'),
        UnidadeProtocolizadora: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblUnidadeProtocolizadora'),
        DataProtocolo: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblDataProtocolo'),
        DataPrioridade: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblDataPrioridade'),
        NumeroProcessoCadastroEmpresa: await this.metodos.pegaTextoElemento('#ctl00_conteudo_lblNumeroProcessoCadastroEmpresa'),
        Link: '',
        PessoasRelacionadas: await this.metodos.pegaTableElemento('#ctl00_conteudo_gridPessoas'),
        Titulos: await this.metodos.pegaTableElemento('#ctl00_conteudo_gridTitulos'),
        Substancias: await this.metodos.pegaTableElemento('#ctl00_conteudo_gridSubstancias'),
        Municipios: await this.metodos.pegaTableElemento('#ctl00_conteudo_gridMunicipios'),
        CondicoesPropriedadeSolo: await this.metodos.pegaTableElemento('#ctl00_conteudo_gridHistoricoPropriedadeSolo'),
        ProcessosAssociados: await this.metodos.pegaTableElemento('#ctl00_conteudo_gridProcessosAssociados'),
        DocumentosProcesso: await this.metodos.pegaTableElemento('#ctl00_conteudo_gridDocumentos'),
        Eventos: await this.metodos.pegaTableElemento('#ctl00_conteudo_gridEventos')
      }
      return processo
    } catch (error) {
      console.log('Erro no metodo pegaProcesso', error)
      throw error
    }
  }
  pesquisaProcesso (numeroProcesso: string, captcha: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  pegaCaptcha (selector: string, tipo: string): Promise<string> {
    throw new Error("Method not implemented.")
  }
}