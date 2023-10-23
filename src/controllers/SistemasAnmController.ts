import { Request, Response } from 'express'
import { ISistemasAnm } from '../interfaces/ISistemasAnm'
import { IDb } from '../interfaces/IDb'

export class SistemasAnmController {
  private sistemasAnm: ISistemasAnm
  private db: IDb
  
  constructor(sistemasAnm: ISistemasAnm, db: IDb) {
    this.sistemasAnm = sistemasAnm
    this.db = db
  }
  
  buscaProcesso = async (req: Request, res: Response) => {
    try {
      const numeroProcesso = req.query.numeroProcesso as string
      let processo = await this.db.buscaProcesso(numeroProcesso)
      if (processo) return processo
      else {
        processo = await this.sistemasAnm.pegaProcesso(numeroProcesso)
        processo = await this.db.insereProcesso(processo)
      }
      return res.status(200).send(processo)
    } catch (error) {
      if (error instanceof Error) return res.status(400).send(error.message)
      else return res.status(500).send('Internal Server Error')
    }
  }
  buscaProcessoEmLote = async (req: Request, res: Response) => {
    res.sendStatus(200)
  }
}