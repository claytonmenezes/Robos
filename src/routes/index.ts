import { Router } from 'express'
import { Db } from '../services/Db'
import { MetodosNavegador } from '../puppeteer/MetodosNavegador'
import { SistemasAnm } from '../puppeteer/SistemasAnm'
import { SistemasAnmController } from '../controllers/SistemasAnmController'
import { SeiAnm } from '../puppeteer/SeiAnm'
import { SeiAnmController } from '../controllers/SeiAnmController'
import { ServicosIbamaController } from '../controllers/ServicosIbamaController'
import { ServicosIbama } from '../puppeteer/ServicosIbama'

const router = Router()

const db = new Db()
const metodosNavegador = new MetodosNavegador()
const sistemasAnm = new SistemasAnm(metodosNavegador)
const sistemasAnmController = new SistemasAnmController(sistemasAnm, metodosNavegador, db)
const seiAnm = new SeiAnm(metodosNavegador)
const seiAnmController = new SeiAnmController(seiAnm, metodosNavegador, db)
const servicosIbama = new ServicosIbama(metodosNavegador)
const servicosIbamaController = new ServicosIbamaController(servicosIbama, metodosNavegador, db)

router.get('/', (_, res) => res.sendStatus(200))
router.get('/SistemasAnm/buscaProcesso', sistemasAnmController.buscaProcesso)
router.get('/SistemasAnm/buscaProcessoEmLote', sistemasAnmController.buscaProcessoEmLote)
router.get('/SistemasAnm/Filtrar', sistemasAnmController.filtrar)
router.get('/SeiAnm/buscaSei', seiAnmController.buscaSei)
router.get('/SeiAnm/buscaSeiEmLote', seiAnmController.buscaSeiEmLote)
router.get('/ServicosIbama/buscaIbama', servicosIbamaController.buscaIbama)
export default router