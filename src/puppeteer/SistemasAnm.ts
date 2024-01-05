import { ElementHandle, Page } from 'puppeteer'
import { esperar, uuid } from '../services/Utils'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import { ISistemasAnm } from '../interfaces/ISistemasAnm'
import { Processo, createProcesso } from '../models/Processo'
import { Evento, createEvento } from '../models/Evento'
import { DocumentoProcesso, createDocumentoProcesso } from '../models/DocumentoProcesso'
import { ProcessoAssociado, createProcessoAssociado } from '../models/ProcessoAssociado'
import { CondicoesPropriedadeSolo, createCondicoesPropriedadeSolo } from '../models/CondicoesPropriedadeSolo'
import { Municipio, createMunicipio } from '../models/Municipio'
import { Substancia, createSubstancia } from '../models/Substancia'
import { Titulo, createTitulo } from '../models/Titulo'
import { PessoaRelacionada, createPessoaRelacionada } from '../models/PessoaRelacionada'

export class SistemasAnm implements ISistemasAnm {
  private metodos: IMetodosNavegador
  
  constructor(metodos: IMetodosNavegador) {
    this.metodos = metodos
  }

  async pegaProcesso (page: Page, numeroProcesso: string): Promise<Processo> {
    const captcha = await this.metodos.pegaCaptcha(page, '#ctl00_conteudo_trCaptcha > td:nth-child(2) > div:nth-child(1) > span:nth-child(1) > img')
    await this.pesquisaProcesso(page, numeroProcesso, captcha)
    const processo = createProcesso({
      NumeroProcesso: numeroProcesso,
      NUP: (await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblNup')).replace('.', '').replace('/', '').replace('-', ''),
      Area: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblArea'),
      TipoRequerimento: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblTipoRequerimento'),
      FaseAtual: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblTipoFase'),
      Ativo: (await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblAtivo')) === 'Sim' ? true : false,
      Superintendencia: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblDistrito'),
      UF: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblUF'),
      UnidadeProtocolizadora: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblUnidadeProtocolizadora'),
      DataProtocolo: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblDataProtocolo'),
      DataPrioridade: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblDataPrioridade'),
      NumeroProcessoCadastroEmpresa: await this.metodos.pegaTextoElemento(page, '#ctl00_conteudo_lblNumeroProcessoCadastroEmpresa'),
      Link: '',
      PessoasRelacionadas: await this.pegaTablePessoaRelacionada(page),
      Titulos: await this.pegaTableTitulo(page),
      Substancias: await this.pegaTableSubstancia(page),
      Municipios: await this.pegaTableMunicipio(page),
      CondicoesPropriedadeSolo: await this.pegaTableCondicoesPropriedadeSolo(page),
      ProcessosAssociados: await this.pegaTableProcessoAssociado(page),
      DocumentosProcesso: await this.pegaTableDocumentoProcesso(page),
      Eventos: await this.pegaTableEvento(page)
    })
    return processo
  }
  async pesquisaProcesso (page: Page, numeroProcesso: string, captcha: string): Promise<void> {
    const input = await page.$('#ctl00_conteudo_txtNumeroProcesso') as ElementHandle<Element>
    await input.click({ clickCount: 3 })
    await input.type('')
    await page.type('#ctl00_conteudo_txtNumeroProcesso', numeroProcesso)
    await page.type('#ctl00_conteudo_trCaptcha > td:nth-child(2) > div:nth-child(1) > span:nth-child(2) > input[type=text]', captcha)
    await page.click('#ctl00_conteudo_btnConsultarProcesso')
    await esperar(1000)
    if (await this.metodos.verificaElementoVisivel(page, '#ctl00_conteudo_ValidationSummary1')) await this.pegaProcesso(page, numeroProcesso)
    else {
      if (await this.metodos.verificaElementoVisivel(page, '#ctl00_conteudo_sumarioConsultar')) throw new Error('Número processo inválido')
      await this.metodos.esperaElementoExistir(page, '#ctl00_upCarregando')
      await this.metodos.esperaElementoSumir(page, '#ctl00_upCarregando')
      await esperar(1000)
    }
  }
  async pegaTablePessoaRelacionada(page: Page): Promise<PessoaRelacionada[]> {
    const pessoasRelacionadas: PessoaRelacionada[] = []
    const elTrs = await page.$$('#ctl00_conteudo_gridPessoas > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let pessoaRelacionada = createPessoaRelacionada({
        Id: uuid(),
        TipoRelacao: await elTr.$eval(`#ctl00_conteudo_gridPessoas > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        CpfCnpj: await elTr.$eval(`#ctl00_conteudo_gridPessoas > tbody > tr:nth-child(${index}) > td:nth-child(2)`, (e) => (e.outerText)),
        Nome: await elTr.$eval(`#ctl00_conteudo_gridPessoas > tbody > tr:nth-child(${index}) > td:nth-child(3)`, (e) => (e.outerText)),
        ResponsabilidadeRepresentacao: await elTr.$eval(`#ctl00_conteudo_gridPessoas > tbody > tr:nth-child(${index}) > td:nth-child(4)`, (e) => (e.outerText)),
        PrazoArrendamento: await elTr.$eval(`#ctl00_conteudo_gridPessoas > tbody > tr:nth-child(${index}) > td:nth-child(5)`, (e) => (e.outerText)),
        DataInicio: await elTr.$eval(`#ctl00_conteudo_gridPessoas > tbody > tr:nth-child(${index}) > td:nth-child(6)`, (e) => (e.outerText)),
        DataFinal: await elTr.$eval(`#ctl00_conteudo_gridPessoas > tbody > tr:nth-child(${index}) > td:nth-child(7)`, (e) => (e.outerText)),
        DataCriacao: new Date()
      })
      pessoasRelacionadas.push(pessoaRelacionada)
    }
    return pessoasRelacionadas
  }
  async pegaTableTitulo(page: Page): Promise<Titulo[]> {
    const titulos: Titulo[] = []
    const elTrs = await page.$$('#ctl00_conteudo_gridTitulos > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let titulo = createTitulo({
        Id: uuid(),
        Numero: await elTr.$eval(`#ctl00_conteudo_gridTitulos > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        Descricao: await elTr.$eval(`#ctl00_conteudo_gridTitulos > tbody > tr:nth-child(${index}) > td:nth-child(2)`, (e) => (e.outerText)),
        TipoTitulo: await elTr.$eval(`#ctl00_conteudo_gridTitulos > tbody > tr:nth-child(${index}) > td:nth-child(3)`, (e) => (e.outerText)),
        SituacaoTitulo: await elTr.$eval(`#ctl00_conteudo_gridTitulos > tbody > tr:nth-child(${index}) > td:nth-child(4)`, (e) => (e.outerText)),
        DataPublicacao: await elTr.$eval(`#ctl00_conteudo_gridTitulos > tbody > tr:nth-child(${index}) > td:nth-child(5)`, (e) => (e.outerText)),
        DataVencimento: await elTr.$eval(`#ctl00_conteudo_gridTitulos > tbody > tr:nth-child(${index}) > td:nth-child(6)`, (e) => (e.outerText)),
        DataCriacao: new Date()
      })
      titulos.push(titulo)
    }
    return titulos
  }
  async pegaTableSubstancia(page: Page): Promise<Substancia[]> {
    const substancias: Substancia[] = []
    const elTrs = await page.$$('#ctl00_conteudo_gridSubstancias > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let substancia = createSubstancia({
        Id: uuid(),
        Nome: await elTr.$eval(`#ctl00_conteudo_gridSubstancias > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        TipoUso: await elTr.$eval(`#ctl00_conteudo_gridSubstancias > tbody > tr:nth-child(${index}) > td:nth-child(2)`, (e) => (e.outerText)),
        DataInicio: await elTr.$eval(`#ctl00_conteudo_gridSubstancias > tbody > tr:nth-child(${index}) > td:nth-child(3)`, (e) => (e.outerText)),
        DataFinal: await elTr.$eval(`#ctl00_conteudo_gridSubstancias > tbody > tr:nth-child(${index}) > td:nth-child(4)`, (e) => (e.outerText)),
        MotivoEncerramento: await elTr.$eval(`#ctl00_conteudo_gridSubstancias > tbody > tr:nth-child(${index}) > td:nth-child(5)`, (e) => (e.outerText)),
        DataCriacao: new Date()
      })
      substancias.push(substancia)
    }
    return substancias
  }
  async pegaTableMunicipio(page: Page): Promise<Municipio[]> {
    const municipios: Municipio[] = []
    const elTrs = await page.$$('#ctl00_conteudo_gridMunicipios > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let municipio = createMunicipio({
        Id: uuid(),
        Nome: await elTr.$eval(`#ctl00_conteudo_gridMunicipios > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        DataCriacao: new Date()
      })
      municipios.push(municipio)
    }
    return municipios
  }
  async pegaTableCondicoesPropriedadeSolo(page: Page): Promise<CondicoesPropriedadeSolo[]> {
    const condicoesPropriedadesSolo: CondicoesPropriedadeSolo[] = []
    const elTrs = await page.$$('#ctl00_conteudo_gridHistoricoPropriedadeSolo > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let condicoesPropriedadeSolo = createCondicoesPropriedadeSolo({
        Id: uuid(),
        Tipo: await elTr.$eval(`#ctl00_conteudo_gridHistoricoPropriedadeSolo > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        DataCriacao: new Date()
      })
      condicoesPropriedadesSolo.push(condicoesPropriedadeSolo)
    }
    return condicoesPropriedadesSolo
  }
  async pegaTableProcessoAssociado(page: Page): Promise<ProcessoAssociado[]> {
    const processosAssociados: ProcessoAssociado[] = []
    const elTrs = await page.$$('#ctl00_conteudo_gridProcessosAssociados > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let processoAssociado = createProcessoAssociado({
        Id: uuid(),
        Processo: await elTr.$eval(`#ctl00_conteudo_gridProcessosAssociados > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        Titular: await elTr.$eval(`#ctl00_conteudo_gridProcessosAssociados > tbody > tr:nth-child(${index}) > td:nth-child(2)`, (e) => (e.outerText)),
        TipoAssociacao: await elTr.$eval(`#ctl00_conteudo_gridProcessosAssociados > tbody > tr:nth-child(${index}) > td:nth-child(3)`, (e) => (e.outerText)),
        DataAssociacao: await elTr.$eval(`#ctl00_conteudo_gridProcessosAssociados > tbody > tr:nth-child(${index}) > td:nth-child(4)`, (e) => (e.outerText)),
        DataDesassociacao: await elTr.$eval(`#ctl00_conteudo_gridProcessosAssociados > tbody > tr:nth-child(${index}) > td:nth-child(5)`, (e) => (e.outerText)),
        ProcessoOriginal: await elTr.$eval(`#ctl00_conteudo_gridProcessosAssociados > tbody > tr:nth-child(${index}) > td:nth-child(6)`, (e) => (e.outerText)),
        Observacao: await elTr.$eval(`#ctl00_conteudo_gridProcessosAssociados > tbody > tr:nth-child(${index}) > td:nth-child(7)`, (e) => (e.outerText)),
        DataCriacao: new Date()
      })
      processosAssociados.push(processoAssociado)
    }
    return processosAssociados
  }
  async pegaTableDocumentoProcesso(page: Page): Promise<DocumentoProcesso[]> {
    const documentosProcesso: DocumentoProcesso[] = []
    const elTrs = await page.$$('#ctl00_conteudo_gridDocumentos > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let documentoProcesso = createDocumentoProcesso({
        Id: uuid(),
        Documento: await elTr.$eval(`#ctl00_conteudo_gridDocumentos > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        DataProtocolo: await elTr.$eval(`#ctl00_conteudo_gridDocumentos > tbody > tr:nth-child(${index}) > td:nth-child(2)`, (e) => (e.outerText)),
        DataCriacao: new Date()
      })
      documentosProcesso.push(documentoProcesso)
    }
    return documentosProcesso
  }
  async pegaTableEvento(page: Page): Promise<Evento[]> {
    const eventos: Evento[] = []
    const elTrs = await page.$$('#ctl00_conteudo_gridEventos > tbody > tr')
    for (let [index, elTr] of elTrs.entries()) {
      if (index === 0) continue
      index++
      let evento = createEvento({
        Id: uuid(),
        Descricao: await elTr.$eval(`#ctl00_conteudo_gridEventos > tbody > tr:nth-child(${index}) > td:nth-child(1)`, (e) => (e.outerText)),
        Data: await elTr.$eval(`#ctl00_conteudo_gridEventos > tbody > tr:nth-child(${index}) > td:nth-child(2)`, (e) => (e.outerText)),
        Observacao: await elTr.$eval(`#ctl00_conteudo_gridEventos > tbody > tr:nth-child(${index}) > td:nth-child(3)`, (e) => (e.outerText)),
        PublicacaoDOU: await elTr.$eval(`#ctl00_conteudo_gridEventos > tbody > tr:nth-child(${index}) > td:nth-child(4)`, (e) => (e.outerText === '\n' ? '' : e.outerText.replace('\n', ' '))),
        DataCriacao: new Date()
      })
      eventos.push(evento)
    }
    return eventos
  }
}
