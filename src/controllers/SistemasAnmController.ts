import { Request, Response } from 'express'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import { ISistemasAnm } from '../interfaces/ISistemasAnm'
import { IDb } from '../interfaces/IDb'

export class SistemasAnmController {
  private metodosNavegador: IMetodosNavegador
  private sistemasAnm: ISistemasAnm
  private db: IDb
  
  constructor(sistemasAnm: ISistemasAnm, metodosNavegador: IMetodosNavegador, db: IDb) {
    this.metodosNavegador = metodosNavegador
    this.sistemasAnm = sistemasAnm
    this.db = db
  }
  
  buscaProcesso = async (req: Request, res: Response) => {
    const client = await this.db.conectar()
    const browser = await this.metodosNavegador.abrirBrowser()
    try {
      const numeroProcesso = req.query.numeroProcesso as string
      let processo = await this.db.buscaProcesso(client, numeroProcesso)
      if (processo) return res.status(200).send(processo)
      else {
        const page = await this.metodosNavegador.navegar(browser, 'https://sistemas.anm.gov.br/SCM/site/admin/dadosProcesso.aspx')
        processo = await this.sistemasAnm.pegaProcesso(page, numeroProcesso)
        processo = await this.db.insereProcesso(client, processo)
      }
      return res.status(200).send(processo) 
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message)
      else return res.status(500).send('Internal Server Error')
    } finally {
      this.db.desconectar(client)
      this.metodosNavegador.fecharBrowser(browser)
    }
  }
  buscaProcessoEmLote = async (req: Request, res: Response) => {
    res.sendStatus(200)
  }
}