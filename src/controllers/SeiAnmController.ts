import { Request, Response } from 'express'
import { ISeiAnm } from '../interfaces/ISeiAnm'
import { IDb } from '../interfaces/IDb'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import axios from 'axios'

export class SeiAnmController {
  private metodosNavegador: IMetodosNavegador
  private seiAnm: ISeiAnm
  private db: IDb
  
  constructor(seiAnm: ISeiAnm, metodosNavegador: IMetodosNavegador, db: IDb) {
    this.seiAnm = seiAnm
    this.metodosNavegador = metodosNavegador
    this.db = db
  }
  
  buscaSei = async (req: Request, res: Response) => {
    const client = await this.db.conectar()
    const browser = await this.metodosNavegador.abrirBrowser()
    try {
      const nup = req.query.nup as string
      let sei = await this.db.buscaSei(client, nup)
      res.status(200).send(sei)
      // if (sei && sei.Link) {
      //   const page = await this.metodosNavegador.navegar(browser, sei?.Link)
      //   sei = await this.seiAnm.pegaSei(page)
      // } else {
      //   const page = await this.metodosNavegador.navegar(browser, 'https://sei.anm.gov.br/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0')
      //   await this.seiAnm.pesquisaSei(page, nup)
      //   sei = await this.seiAnm.pegaSei(page)
      // }
      // const processo = await this.db.buscaProcessoPorNup(client, nup)
      // if (sei && processo && processo.Id) sei = await this.db.insereSei(client, sei, processo?.Id)
      // axios({
      //   baseURL: process.env.URL_SOCKET,
      //   params: {sessionId: req.query.sessionId},
      //   url: '/buscaSei',
      //   data: sei
      // })
    } finally {
      this.db.desconectar(client)
      this.metodosNavegador.fecharBrowser(browser)
    }
  }
  buscaSeiEmLote = async (req: Request, res: Response) => {
    res.sendStatus(200)
  }
}