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
    const browser = await this.metodosNavegador.abrirBrowser()
    try {
      const numeroProcesso = req.query.numeroProcesso as string
      let processoDb = await this.db.buscaProcesso(client, numeroProcesso)
      res.status(200).send(processoDb)
      const page = await this.metodosNavegador.navegar(browser, 'https://sistemas.anm.gov.br/SCM/site/admin/dadosProcesso.aspx')
      let processo = await this.sistemasAnm.pegaProcesso(page, numeroProcesso)
      if (processoDb && processoDb.Id) this.db.deletaProcesso(client, processoDb.Id)
      processo = await this.db.insereProcesso(client, processo, processoDb?.Id)
      if (req.query.sessionId) {
        axios({
          baseURL: process.env.URL_SOCKET,
          params: {sessionId: req.query.sessionId},
          url: '/buscaProcesso',
          data: processo
        })
      }
    } finally {
      this.db.desconectar(client)
      this.metodosNavegador.fecharBrowser(browser)
    }
  }
  buscaProcessoEmLote = async (req: Request, res: Response) => {
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
      if (req.query.sessionId) {
        axios({
          baseURL: process.env.URL_SOCKET,
          params: {sessionId: req.query.sessionId},
          url: '/buscaProcessoEmLote',
          data: processos
        })
      }
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