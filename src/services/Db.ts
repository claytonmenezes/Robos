import { IDb } from '../interfaces/IDb'
import { CondicoesPropriedadeSolo } from '../models/CondicoesPropriedadeSolo'
import { DocumentoProcesso } from '../models/DocumentoProcesso'
import { Evento, createEvento } from '../models/Evento'
import { Municipio } from '../models/Municipio'
import { PessoaRelacionada } from '../models/PessoaRelacionada'
import { ProcessoAssociado } from '../models/ProcessoAssociado'
import { Processo } from '../models/Processo'
import { Sei } from '../models/Sei'
import { Client } from 'pg'
import { Substancia } from '../models/Substancia'
import { Titulo } from '../models/Titulo'
import { Andamento } from '../models/Andamento'
import { Protocolo } from '../models/Protocolo'

export class Db implements IDb {
  async conectar(): Promise<Client> {
    const client = new Client(process.env.DATABASE_URL)
    await client.connect()
    return client
  }
  async desconectar(client: Client): Promise<void> {
    await client.end()
  }
  async insereProcesso(client: Client, processo: Processo): Promise<Processo> {
    const queryResultProcessos = await client.query<Processo>(
      `insert into Processo (NumeroProcesso, NUP, Area, TipoRequerimento, FaseAtual, Ativo, Superintendencia, UF, UnidadeProtocolizadora, DataProtocolo, DataPrioridade, NumeroProcessoCadastroEmpresa, Link)
        values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) select * from Processo where Id = $$identity`,
      [processo.NumeroProcesso, processo.NUP, processo.Area, processo.TipoRequerimento, processo.FaseAtual, processo.Ativo, processo.Superintendencia, processo.UF, processo.UnidadeProtocolizadora, processo.DataProtocolo, processo.DataPrioridade, processo.NumeroProcessoCadastroEmpresa, processo.Link]
    )
    return queryResultProcessos.rows[0]
  }
  async insereCondicoesPropriedadeSolo(client: Client, condicoesPropriedadeSolo: CondicoesPropriedadeSolo[], processoId: string): Promise<CondicoesPropriedadeSolo[]> {
    const queryResultCondicoesPropriedadeSolo = await client.query<CondicoesPropriedadeSolo>(`
      insert into CondicaoPropriedadeSolo (Tipo, DataCriacao, ProcessoId)
      values ${condicoesPropriedadeSolo.map(cp => (`(${cp.Tipo}, ${cp.DataCriacao}, ${processoId})`)).toString()}
      select * from CondicaoPropriedadeSolo where ProcessoId = ${processoId}`
    )
    return queryResultCondicoesPropriedadeSolo.rows
  }
  async insereDocumentosProcesso(client: Client, documentosProcesso: DocumentoProcesso[], processoId: string): Promise<DocumentoProcesso[]> {
    const queryResultDocumentoProcesso = await client.query<DocumentoProcesso>(`
      insert into DocumentoProcesso (Documento, DataProtocolo, DataCriacao, ProcessoId)
      values ${documentosProcesso.map(dp => (`(${dp.Documento}, ${dp.DataProtocolo}, ${dp.DataCriacao}, ${processoId})`)).toString()}
      select * from DocumentoProcesso where ProcessoId = ${processoId}`
    )
    return queryResultDocumentoProcesso.rows
  }
  async insereEventos(client: Client, eventos: Evento[], processoId: string): Promise<Evento[]> {
    try {
      let sql = 'insert into Evento (Descricao, Data, DataCriacao, ProcessoId) values'
      for (const evento of eventos) {
        const _evento = createEvento(evento)
        sql += ` (${_evento.Descricao}, ${_evento.Data}, ${_evento.DataCriacao}, ${processoId})`
      }
      sql += `select * from Evento where ProcessoId = ${processoId}`
      const queryResultEvento = await client.query<Evento>(sql)
      return queryResultEvento.rows  
    } catch (error) {
      throw error
    }
  }
  async insereMunicipios(client: Client, municipios: Municipio[], processoId: string): Promise<Municipio[]> {
    const queryResultMunicipio = await client.query<Municipio>(`
      insert into Municipio (Nome, DataCriacao, ProcessoId)
      values ${municipios.map(m => (`(${m.Nome}, ${m.DataCriacao}, ${processoId})`)).toString()}
      select * from Municipio where ProcessoId = ${processoId}`
    )
    return queryResultMunicipio.rows
  }
  async inserePessoasRelacionadas(client: Client, pessoasRelacionadas: PessoaRelacionada[], processoId: string): Promise<PessoaRelacionada[]> {
    const queryResultPessoaRelacionada = await client.query<PessoaRelacionada>(`
      insert into PessoaRelacionada (TipoRelacao, CpfCnpj, Nome, ResponsabilidadeRepresentacao, PrazoArrendamento, DataInicio, DataFinal, DataCriacao, ProcessoId)
      values ${pessoasRelacionadas.map(pr => (`(${pr.TipoRelacao}, ${pr.CpfCnpj}, ${pr.Nome}, ${pr.ResponsabilidadeRepresentacao}, ${pr.PrazoArrendamento}, ${pr.DataInicio}, ${pr.DataFinal}, ${pr.DataCriacao}, ${processoId})`)).toString()}
      select * from PessoaRelacionada where ProcessoId = ${processoId}`
    )
    return queryResultPessoaRelacionada.rows
  }
  async insereProcessosAssociados(client: Client, processosAssociados: ProcessoAssociado[], processoId: string): Promise<ProcessoAssociado[]> {
    const queryResultProcessoAssociado = await client.query<ProcessoAssociado>(`
      insert into ProcessoAssociado (Processo, Titular, TipoAssociacao, DataAssociacao, DataDesassociacao, ProcessoOriginal, Observacao, Link, DataCriacao, ProcessoId)
      values ${processosAssociados.map(pa => (`(${pa.Processo}, ${pa.Titular}, ${pa.TipoAssociacao}, ${pa.DataAssociacao}, ${pa.DataDesassociacao}, ${pa.ProcessoOriginal}, ${pa.Observacao}, ${pa.Link}, ${pa.DataCriacao}, ${processoId})`)).toString()}
      select * from ProcessoAssociado where ProcessoId = ${processoId}`
    )
    return queryResultProcessoAssociado.rows
  }
  async insereTitulos(client: Client, titulos: Titulo[], processoId: string): Promise<Titulo[]> {
    const queryResultTitulo = await client.query<Titulo>(`
      insert into Titulo (Numero, Descricao, TipoTitulo, SituacaoTitulo, DataPublicacao, DataVencimento, DataCriacao, ProcessoId)
      values ${titulos.map(t => (`(${t.Numero}, ${t.Descricao}, ${t.TipoTitulo}, ${t.SituacaoTitulo}, ${t.DataPublicacao}, ${t.DataVencimento}, ${t.DataCriacao}, ${processoId})`)).toString()}
      select * from Titulo where ProcessoId = ${processoId}`
    )
    return queryResultTitulo.rows
  }
  async insereSubstancias(client: Client, substancias: Substancia[], processoId: string): Promise<Substancia[]> {
    const queryResultSubstancia = await client.query<Substancia>(`
      insert into Substancia (Nome, TipoUso, DataInicio, DataFinal, MotivoEncerramento, DataCriacao, ProcessoId)
      values ${substancias.map(s => (`(${s.Nome}, ${s.TipoUso}, ${s.DataInicio}, ${s.DataFinal}, ${s.MotivoEncerramento}, ${s.DataCriacao}, ${processoId})`)).toString()}
      select * from Substancia where ProcessoId = ${processoId}`
    )
    return queryResultSubstancia.rows
  }
  async insereSei(client: Client, sei: Sei, processoId: string): Promise<Sei> {
    const queryResultSei = await client.query<Sei>(`
      insert into Sei (Processo, Tipo, DataRegistro, Interessados, Link, ProcessoId)
      values (${sei.Processo}, ${sei.Tipo}, ${sei.DataRegistro}, ${sei.Interessados}, ${sei.Link}, ${processoId})
      select * from Sei where ProcessoId = ${processoId}`
    )
    return queryResultSei.rows[0]
  }
  async insereProtocolos(client: Client, protocolos: Protocolo[], seiId: string): Promise<Protocolo[]> {
    const queryResultProtocolo = await client.query<Protocolo>(`
      insert into Protocolo (DocumentoProcesso, TipoDocumento, DataDocumento, DataRegistro, Unidade, Link, DataCriacao, SeiId)
      values ${protocolos.map(p => (`(${p.DocumentoProcesso}, ${p.TipoDocumento}, ${p.DataDocumento}, ${p.DataRegistro}, ${p.Unidade}, ${p.Link}, ${p.DataCriacao}, ${seiId})`)).toString()}
      select * from Protocolo where SeiId = ${seiId}`
    )
    return queryResultProtocolo.rows
  }
  async insereAndamentos(client: Client, andamentos: Andamento[], seiId: string): Promise<Andamento[]> {
    const queryResultAndamento = await client.query<Andamento>(`
      insert into Andamento (DataHora, Unidade, Descricao, DataCriacao, SeiId)
      values ${andamentos.map(a => (`(${a.DataHora}, ${a.Unidade}, ${a.Descricao}, ${a.DataCriacao}, ${seiId})`)).toString()}
      select * from Andamento where SeiId = ${seiId}`
    )
    return queryResultAndamento.rows
  }
  async buscaProcesso(client: Client, numeroProcesso: string): Promise<Processo> {
    const queryResultProcessos = await client.query<Processo>(`select * from "Processo" where "NumeroProcesso" = $1`, [numeroProcesso])
    return queryResultProcessos.rows[0]
  }
  async buscaProcessoPorNup(client: Client, nup: string): Promise<Processo> {
    const queryResultProcessos = await client.query<Processo>('select * from Processo where NUP = $1', [nup])
    return queryResultProcessos.rows[0]
  }
  async buscaSei(client: Client, nup: string): Promise<Sei> {
    const queryResultSei = await client.query<Sei>('select * from Sei where Processo = $1', [nup])
    return queryResultSei.rows[0]
  }
  async deletaProcesso(client: Client, processoId: string): Promise<void> {
    await client.query(`
      delete from CondicaoPropriedadeSolo where ProcessoId = ${processoId}
      delete from DocumentoProcesso where ProcessoId = ${processoId}
      delete from Evento where ProcessoId = ${processoId}
      delete from Municipio where ProcessoId = ${processoId}
      delete from PessoaRelacionada where ProcessoId = ${processoId}
      delete from ProcessoAssociado where ProcessoId = ${processoId}
      delete from Substancia where ProcessoId = ${processoId}
      delete from Titulo where ProcessoId = ${processoId}
      delete from Andamento a where exists (select 3 from Sei s where a.SeiId = s.Id and s.ProcessoId = ${processoId})
      delete from Protocolo p where exists (select 3 from Sei s where p.SeiId = s.Id and s.ProcessoId = ${processoId})
      delete from Sei where ProcessoId = ${processoId}
      delete from Processo where Id = ${processoId}`
    )
  }
  async deletaSei(client: Client,seiId: string): Promise<void> {
    await client.query(`
      delete from Andamento where SeiId = ${seiId}
      delete from Protocolo where SeiId = ${seiId}
      delete from Sei where Id = ${seiId}`
    )
  }
}