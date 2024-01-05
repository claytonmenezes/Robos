import { Page } from 'puppeteer'
import { Processo } from '../models/Processo'
import { PessoaRelacionada } from '../models/PessoaRelacionada'
import { Titulo } from '../models/Titulo'
import { Substancia } from '../models/Substancia'
import { Municipio } from '../models/Municipio'
import { CondicoesPropriedadeSolo } from '../models/CondicoesPropriedadeSolo'
import { ProcessoAssociado } from '../models/ProcessoAssociado'
import { DocumentoProcesso } from '../models/DocumentoProcesso'
import { Evento } from '../models/Evento'

export interface ISistemasAnm {
  pesquisaProcesso (page: Page, numeroProcesso: string, captcha: string): Promise<void>
  pegaProcesso (page: Page, numeroProcesso: string): Promise<Processo>
  pegaTablePessoaRelacionada (page: Page): Promise<PessoaRelacionada[]>
  pegaTableTitulo (page: Page): Promise<Titulo[]>
  pegaTableSubstancia (page: Page): Promise<Substancia[]>
  pegaTableMunicipio (page: Page): Promise<Municipio[]>
  pegaTableCondicoesPropriedadeSolo (page: Page): Promise<CondicoesPropriedadeSolo[]>
  pegaTableProcessoAssociado (page: Page): Promise<ProcessoAssociado[]>
  pegaTableDocumentoProcesso (page: Page): Promise<DocumentoProcesso[]>
  pegaTableEvento (page: Page): Promise<Evento[]>
}