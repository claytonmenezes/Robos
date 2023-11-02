import { AndamentoModel } from "./AndamentoModel"
import { ProtocoloModel } from "./ProtocoloModel"

export class SeiModel {
  Id?: string
  Processo?: string
  Tipo?: string
  DataRegistro?: string
  Interessados?: string
  Link?: string
  Protocolos?: ProtocoloModel[]
  Andamentos?: AndamentoModel[]
}