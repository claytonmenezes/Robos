import { Router } from 'express'
import { SistemasAnmController } from '../controllers/SistemasAnmController'
import { MetodosNavegador } from '../puppeteer/MetodosNavegador'
import { SistemasAnm } from '../puppeteer/SistemasAnm'
import { SeiAnm } from '../puppeteer/SeiAnm'
import { SeiAnmController } from '../controllers/SeiAnmController'
import { Db } from '../services/Db'

const metodosNavegador = new MetodosNavegador()
const db = new Db()
const sistemasAnm = new SistemasAnm(metodosNavegador)
const seiAnm = new SeiAnm(metodosNavegador)
const sistemasAnmController = new SistemasAnmController(sistemasAnm, db)
const seiAnmController = new SeiAnmController(seiAnm, db)

const router = Router()

router.get('/', (_, res) => res.sendStatus(200))
router.get('/buscaProcesso', sistemasAnmController.buscaProcesso)
router.get('/buscaProcessoEmLote', sistemasAnmController.buscaProcessoEmLote)
router.get('/buscaSei', seiAnmController.buscaSei)
router.get('/buscaSeiEmLote', seiAnmController.buscaSeiEmLote)

export default router