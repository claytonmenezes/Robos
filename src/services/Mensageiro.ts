import amqp from 'amqplib'
import { MetodosNavegador } from '../puppeteer/MetodosNavegador'
import { SistemasAnm } from '../puppeteer/SistemasAnm'
import { Db } from './Db'
import axios from 'axios'

const metodosNavegador = new MetodosNavegador()
const sistemasAnm = new SistemasAnm(metodosNavegador)
const db = new Db()

const conectarRabbit = () => {
  return amqp.connect({
    hostname: process.env.RABBIT_HOSTNAME,
    port: parseInt(process.env.RABBIT_PORT!),
    username: process.env.RABBIT_USERNAME,
    password: process.env.RABBIT_PASSWORD
  })
}

const pegaPesquisasProcesso = async () => {
  const conexao = await conectarRabbit()
  const canal = await conexao.createChannel()
  canal.prefetch(1)
  canal.consume('PesquisaProcesso', async (msg) => {
    if (!msg) return
    // const dadosDaMsg = JSON.parse(msg.content.toString())

    // const browser = await metodosNavegador.abrirBrowser()
    // const client = await db.conectar()
    
    // const page = await metodosNavegador.navegar(browser, 'https://sistemas.anm.gov.br/SCM/site/admin/dadosProcesso.aspx')
    // let processo = await sistemasAnm.pegaProcesso(page, dadosDaMsg.numeroProcesso)
    
    // if (processoDb && processoDb.Id) db.deletaProcesso(client, processoDb.Id)
    // processo = await db.insereProcesso(client, processo, processoDb?.Id)
    // if (dadosDaMsg.sessionId) {
    //   axios({
    //     baseURL: process.env.URL_SOCKET,
    //     params: {sessionId: dadosDaMsg.sessionId},
    //     url: '/buscaProcesso',
    //     data: processo
    //   })
    // }
    canal.ack(msg)
  }, {
    noAck: false
  }).catch((err) => console.error(`Erro ao consumir a fila PesquisaProcesso: ${err}`))
}
const pegaPesquisasSei = async () => {
  const conexao = await conectarRabbit()
  const canal = await conexao.createChannel()
  canal.prefetch(1)
  canal.consume('PesquisaSei', (msg) => {
    if (!msg) return
    const dadosDaMsg = JSON.parse(msg.content.toString())
    console.log(dadosDaMsg)
    canal.ack(msg)
  }, {
    noAck: false
  }).catch((err) => console.error(`Erro ao consumir a fila PesquisaSei: ${err}`))
}

export {
  pegaPesquisasProcesso,
  pegaPesquisasSei
}