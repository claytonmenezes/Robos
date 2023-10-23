import { AndamentoModel } from "./AndamentoModel"
import { ProtocoloModel } from "./ProtocoloModel"

export class SeiModel {
  Processo?: string
  Tipo?: string
  DataRegistro?: string
  Interessados?: string
  Link?: string
  Protocolos?: ProtocoloModel[]
  Andamentos?: AndamentoModel[]
}