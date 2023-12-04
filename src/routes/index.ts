import { Router } from 'express'
import { Db } from '../services/Db'
import { MetodosNavegador } from '../puppeteer/MetodosNavegador'
import { SistemasAnm } from '../puppeteer/SistemasAnm'
import { SistemasAnmController } from '../controllers/SistemasAnmController'
import { SeiAnm } from '../puppeteer/SeiAnm'
import { SeiAnmController } from '../controllers/SeiAnmController'

const router = Router()

const db = new Db()
const metodosNavegador = new MetodosNavegador()
const sistemasAnm = new SistemasAnm(metodosNavegador)
const sistemasAnmController = new SistemasAnmController(sistemasAnm, metodosNavegador, db)
const seiAnm = new SeiAnm(metodosNavegador)
const seiAnmController = new SeiAnmController(seiAnm, db)

router.get('/', (_, res) => res.sendStatus(200))
router.get('/buscaProcesso', sistemasAnmController.buscaProcesso)
router.get('/buscaProcessoEmLote', sistemasAnmController.buscaProcessoEmLote)
router.get('/buscaSei', seiAnmController.buscaSei)
router.get('/buscaSeiEmLote', seiAnmController.buscaSeiEmLote)

export default router