import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './src/routes'

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)
const port = process.env.PORT || 8090

const start = async () => {
  try {
    app.listen(port, () => console.log(`Extração Processo Rodando na Porta ${port}`))
  } catch (error) {
    console.error(error)
  }
}

start()