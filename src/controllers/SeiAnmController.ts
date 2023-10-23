import { Request, Response } from 'express'
import { ISeiAnm } from '../interfaces/ISeiAnm'
import { IDb } from '../interfaces/IDb'

export class SeiAnmController {
  private seiAnm: ISeiAnm
  private db: IDb
  
  constructor(seiAnm: ISeiAnm, db: IDb) {
    this.seiAnm = seiAnm
    this.db = db
  }
  
  buscaSei = async (req: Request, res: Response) => {
    res.sendStatus(200)
  }
  buscaSeiEmLote = async (req: Request, res: Response) => {
    res.sendStatus(200)
  }
}