import { Request, Response } from 'express'
import { IMetodosNavegador } from '../interfaces/IMetodosNavegador'
import { ISistemasAnm } from '../interfaces/ISistemasAnm'
import { IDb } from '../interfaces/IDb'
import { Processo } from '../models/Processo'
import axios from 'axios'

export class SistemasAnmController {
  private metodosNavegador: IMetodosNavegador
  private sistemasAnm: ISistemasAnm
  private db: IDb
  
  constructor(sistemasAnm: ISistemasAnm, metodosNavegador: IMetodosNavegador, db: IDb) {
    this.sistemasAnm = sistemasAnm
    this.metodosNavegador = metodosNavegador
    this.db = db
  }
  buscaProcesso = async (req: Request, res: Response) => {
    console.log('inicio buscaProcesso')
    const client = await this.db.conectar()
    try {
      const numeroProcesso = req.query.numeroProcesso as string
      let processoDb = await this.db.buscaProcesso(client, numeroProcesso)
      //TODO INCLUIR NO MENSAGEIRO
      return res.status(200).send(processoDb)
    } finally {
      this.db.desconectar(client)
    }
  }
  buscaProcessoEmLote = async (req: Request, res: Response) => {
    res.sendStatus(200)
    const browser = await this.metodosNavegador.abrirBrowser()
    try {
      const numerosProcesso = req.body.numerosProcesso as string[]
      const processos: Processo[] = []
      for (const numeroProcesso of numerosProcesso) {
        const page = await this.metodosNavegador.navegar(browser, 'https://sistemas.anm.gov.br/SCM/site/admin/dadosProcesso.aspx')
        let processo = await this.sistemasAnm.pegaProcesso(page, numeroProcesso)
        if (processo) {
          const client = await this.db.conectar()
          try {
            const processoDb = await this.db.buscaProcesso(client, numeroProcesso)
            if (processoDb && processoDb.Id) this.db.deletaProcesso(client, processoDb.Id)
            processo = await this.db.insereProcesso(client, processo, processoDb?.Id)
            processos.push(processo)
          } finally {
            this.metodosNavegador.fecharAba(page)
            this.db.desconectar(client)
          }
        }
      }
      axios({
        baseURL: process.env.URL_PLATAFORMA,
        method: 'Post',
        url: 'api/callback/processes/update',
        data: {processos}
      })
    } catch (error) {
      console.error(error)
      return  res.status(500).json({ error: 'Erro ao pegar os dados do processo'})
    } finally {
      this.metodosNavegador.fecharBrowser(browser)
    }
  }
  filtrar = async (req: Request, res: Response) => {
    try {
      const client = await this.db.conectar()
      try {
        const filtro = req.query.filtro
        const processos = await this.db.filtrar(client, filtro as string)
        res.send(processos).status(200)
      } catch (error) {
        res.send(error).status(500)
      } finally {
        await  this.db.desconectar(client)
      }
    } catch (error) {
      res.send(error).status(500)
    }
  }
}