import { Request, Response } from 'express'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import { IServicosIbama } from '../interfaces/IServicosIbama'
import { IDb } from '../interfaces/IDb'
import { esperar } from '../services/Utils'

export class ServicosIbamaController {
  private metodosNavegador: IMetodosNavegador
  private servicosIbama: IServicosIbama
  private db: IDb
  
  constructor(servicosIbama: IServicosIbama, metodosNavegador: IMetodosNavegador, db: IDb) {
    this.servicosIbama = servicosIbama
    this.metodosNavegador = metodosNavegador
    this.db = db
  }
  buscaIbama = async (req: Request, res: Response) => {
    console.log('inicio buscar Ibama')
    const client = await this.db.conectar()
    const browser = await this.metodosNavegador.abrirBrowser()
    try {
      const cpfcnpj = req.query.cpfcnpj as string
      let ibamaDb = await this.db.buscaIbama(client, cpfcnpj)
      const page = await browser.newPage()
      let ibama = await this.servicosIbama.pegaIbama(page, cpfcnpj)
      if (ibamaDb && ibamaDb.Id) await this.db.deletaIbama(client, ibamaDb.Id)
      ibama = await this.db.insereIbama(client, ibama, ibamaDb?.Id)
      return res.status(200).json(ibama)
    } finally {
      this.db.desconectar(client)
      await esperar(1000)
      this.metodosNavegador.fecharBrowser(browser)
    }
  }
}