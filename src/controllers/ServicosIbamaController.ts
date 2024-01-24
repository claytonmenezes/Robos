import { Request, Response } from 'express'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import { IServicosIbama } from '../interfaces/IServicosIbama'
import { IDb } from '../interfaces/IDb'
import axios from 'axios'

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
      res.status(200).send(ibamaDb)
      const page = await this.metodosNavegador.navegar(browser, 'https://servicos.ibama.gov.br/ctf/publico/certificado_regularidade_consulta.php')
      let ibama = await this.servicosIbama.pegaIbama(page, cpfcnpj)
      if (ibamaDb && ibamaDb.Id) this.db.deletaIbama(client, ibamaDb.Id)
      ibama = await this.db.insereIbama(client, ibama, ibamaDb?.Id)
      if (req.query.sessionId) {
        axios({
          baseURL: process.env.URL_SOCKET,
          params: {sessionId: req.query.sessionId},
          url: '/buscaIbama',
          data: ibama
        })
      }
    } finally {
      this.db.desconectar(client)
      this.metodosNavegador.fecharBrowser(browser)
    }
  }
}