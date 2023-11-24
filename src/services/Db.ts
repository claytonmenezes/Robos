import { IDb } from '../interfaces/IDb'
import { CondicoesPropriedadeSoloModel } from '../models/CondicoesPropriedadeSoloModel'
import { DocumentoProcessoModel } from '../models/DocumentoProcessoModel'
import { EventoModel } from '../models/EventoModel'
import { MunicipioModel } from '../models/MunicipioModel'
import { PessoaRelacionadaModel } from '../models/PessoaRelacionadaModel'
import { ProcessoAssociadoModel } from '../models/ProcessoAssociadoModel'
import { ProcessoModel } from '../models/ProcessoModel'
import { SeiModel } from '../models/SeiModel'
import { Client } from 'pg'
import { SubstanciaModel } from '../models/SubstanciaModel'
import { TituloModel } from '../models/TituloModel'
import { AndamentoModel } from '../models/AndamentoModel'
import { ProtocoloModel } from '../models/ProtocoloModel'

export class Db implements IDb {
  async conectar(): Promise<Client> {
    const client = new Client(process.env.DATABASE_URL)
    await client.connect()
    return client
  }
  async desconectar(client: Client): Promise<void> {
    await client.end()
  }
  async insereProcesso(client: Client, processo: ProcessoModel): Promise<ProcessoModel> {
    const queryResultProcessos = await client.query<ProcessoModel>(
      `insert into Processo (NumeroProcesso, NUP, Area, TipoRequerimento, FaseAtual, Ativo, Superintendencia, UF, UnidadeProtocolizadora, DataProtocolo, DataPrioridade, NumeroProcessoCadastroEmpresa, Link)
        values(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10, @p11, @p12) select * from Processo where Id = @@identity`,
      [processo.NumeroProcesso, processo.NUP, processo.Area, processo.TipoRequerimento, processo.FaseAtual, processo.Ativo, processo.Superintendencia, processo.UF, processo.UnidadeProtocolizadora, processo.DataProtocolo, processo.DataPrioridade, processo.NumeroProcessoCadastroEmpresa, processo.Link]
    )
    return queryResultProcessos.rows[0]
  }
  async insereCondicoesPropriedadeSolo(client: Client, condicoesPropriedadeSolo: CondicoesPropriedadeSoloModel[], processoId: string): Promise<CondicoesPropriedadeSoloModel[]> {
    const queryResultCondicoesPropriedadeSolo = await client.query<CondicoesPropriedadeSoloModel>(`
      insert into CondicaoPropriedadeSolo (Tipo, DataCriacao, ProcessoId)
      values ${condicoesPropriedadeSolo.map(cp => (`(${cp.Tipo}, ${cp.DataCriacao}, ${processoId})`)).toString()}
      select * from CondicaoPropriedadeSolo where ProcessoId = ${processoId}`
    )
    return queryResultCondicoesPropriedadeSolo.rows
  }
  async insereDocumentosProcesso(client: Client, documentosProcesso: DocumentoProcessoModel[], processoId: string): Promise<DocumentoProcessoModel[]> {
    const queryResultDocumentoProcesso = await client.query<DocumentoProcessoModel>(`
      insert into DocumentoProcesso (Documento, DataProtocolo, DataCriacao, ProcessoId)
      values ${documentosProcesso.map(dp => (`(${dp.Documento}, ${dp.DataProtocolo}, ${dp.DataCriacao}, ${processoId})`)).toString()}
      select * from DocumentoProcesso where ProcessoId = ${processoId}`
    )
    return queryResultDocumentoProcesso.rows
  }
  async insereEventos(client: Client, eventos: EventoModel[], processoId: string): Promise<EventoModel[]> {
    const queryResultEvento = await client.query<EventoModel>(`
      insert into Evento (Descricao, Data, DataCriacao, ProcessoId)
      values ${eventos.map(e => (`(${e.Descricao}, ${e.Data}, ${e.DataCriacao}, ${processoId})`)).toString()}
      select * from Evento where ProcessoId = ${processoId}`
    )
    return queryResultEvento.rows
  }
  async insereMunicipios(client: Client, municipios: MunicipioModel[], processoId: string): Promise<MunicipioModel[]> {
    const queryResultMunicipio = await client.query<MunicipioModel>(`
      insert into Municipio (Nome, DataCriacao, ProcessoId)
      values ${municipios.map(m => (`(${m.Nome}, ${m.DataCriacao}, ${processoId})`)).toString()}
      select * from Municipio where ProcessoId = ${processoId}`
    )
    return queryResultMunicipio.rows
  }
  async inserePessoasRelacionadas(client: Client, pessoasRelacionadas: PessoaRelacionadaModel[], processoId: string): Promise<PessoaRelacionadaModel[]> {
    const queryResultPessoaRelacionada = await client.query<PessoaRelacionadaModel>(`
      insert into PessoaRelacionada (TipoRelacao, CpfCnpj, Nome, ResponsabilidadeRepresentacao, PrazoArrendamento, DataInicio, DataFinal, DataCriacao, ProcessoId)
      values ${pessoasRelacionadas.map(pr => (`(${pr.TipoRelacao}, ${pr.CpfCnpj}, ${pr.Nome}, ${pr.ResponsabilidadeRepresentacao}, ${pr.PrazoArrendamento}, ${pr.DataInicio}, ${pr.DataFinal}, ${pr.DataCriacao}, ${processoId})`)).toString()}
      select * from PessoaRelacionada where ProcessoId = ${processoId}`
    )
    return queryResultPessoaRelacionada.rows
  }
  async insereProcessosAssociados(client: Client, processosAssociados: ProcessoAssociadoModel[], processoId: string): Promise<ProcessoAssociadoModel[]> {
    const queryResultProcessoAssociado = await client.query<ProcessoAssociadoModel>(`
      insert into ProcessoAssociado (Processo, Titular, TipoAssociacao, DataAssociacao, DataDesassociacao, ProcessoOriginal, Observacao, Link, DataCriacao, ProcessoId)
      values ${processosAssociados.map(pa => (`(${pa.Processo}, ${pa.Titular}, ${pa.TipoAssociacao}, ${pa.DataAssociacao}, ${pa.DataDesassociacao}, ${pa.ProcessoOriginal}, ${pa.Observacao}, ${pa.Link}, ${pa.DataCriacao}, ${processoId})`)).toString()}
      select * from ProcessoAssociado where ProcessoId = ${processoId}`
    )
    return queryResultProcessoAssociado.rows
  }
  async insereTitulos(client: Client, titulos: TituloModel[], processoId: string): Promise<TituloModel[]> {
    const queryResultTitulo = await client.query<TituloModel>(`
      insert into Titulo (Numero, Descricao, TipoTitulo, SituacaoTitulo, DataPublicacao, DataVencimento, DataCriacao, ProcessoId)
      values ${titulos.map(t => (`(${t.Numero}, ${t.Descricao}, ${t.TipoTitulo}, ${t.SituacaoTitulo}, ${t.DataPublicacao}, ${t.DataVencimento}, ${t.DataCriacao}, ${processoId})`)).toString()}
      select * from Titulo where ProcessoId = ${processoId}`
    )
    return queryResultTitulo.rows
  }
  async insereSubstancias(client: Client, substancias: SubstanciaModel[], processoId: string): Promise<SubstanciaModel[]> {
    const queryResultSubstancia = await client.query<SubstanciaModel>(`
      insert into Substancia (Nome, TipoUso, DataInicio, DataFinal, MotivoEncerramento, DataCriacao, ProcessoId)
      values ${substancias.map(s => (`(${s.Nome}, ${s.TipoUso}, ${s.DataInicio}, ${s.DataFinal}, ${s.MotivoEncerramento}, ${s.DataCriacao}, ${processoId})`)).toString()}
      select * from Substancia where ProcessoId = ${processoId}`
    )
    return queryResultSubstancia.rows
  }
  async insereSei(client: Client, sei: SeiModel, processoId: string): Promise<SeiModel> {
    const queryResultSei = await client.query<SeiModel>(`
      insert into Sei (Processo, Tipo, DataRegistro, Interessados, Link, ProcessoId)
      values (${sei.Processo}, ${sei.Tipo}, ${sei.DataRegistro}, ${sei.Interessados}, ${sei.Link}, ${processoId})
      select * from Sei where ProcessoId = ${processoId}`
    )
    return queryResultSei.rows[0]
  }
  async insereProtocolos(client: Client, protocolos: ProtocoloModel[], seiId: string): Promise<ProtocoloModel[]> {
    const queryResultProtocolo = await client.query<ProtocoloModel>(`
      insert into Protocolo (DocumentoProcesso, TipoDocumento, DataDocumento, DataRegistro, Unidade, Link, DataCriacao, SeiId)
      values ${protocolos.map(p => (`(${p.DocumentoProcesso}, ${p.TipoDocumento}, ${p.DataDocumento}, ${p.DataRegistro}, ${p.Unidade}, ${p.Link}, ${p.DataCriacao}, ${seiId})`)).toString()}
      select * from Protocolo where SeiId = ${seiId}`
    )
    return queryResultProtocolo.rows
  }
  async insereAndamentos(client: Client, andamentos: AndamentoModel[], seiId: string): Promise<AndamentoModel[]> {
    const queryResultAndamento = await client.query<AndamentoModel>(`
      insert into Andamento (DataHora, Unidade, Descricao, DataCriacao, SeiId)
      values ${andamentos.map(a => (`(${a.DataHora}, ${a.Unidade}, ${a.Descricao}, ${a.DataCriacao}, ${seiId})`)).toString()}
      select * from Andamento where SeiId = ${seiId}`
    )
    return queryResultAndamento.rows
  }
  async buscaProcesso(client: Client, numeroProcesso: string): Promise<ProcessoModel> {
    const queryResultProcessos = await client.query<ProcessoModel>('select * from Processo where NumeroProcesso = @p0', [numeroProcesso])
    return queryResultProcessos.rows[0]
  }
  async buscaProcessoPorNup(client: Client, nup: string): Promise<ProcessoModel> {
    const queryResultProcessos = await client.query<ProcessoModel>('select * from Processo where NUP = @p0', [nup])
    return queryResultProcessos.rows[0]
  }
  async buscaSei(client: Client, nup: string): Promise<SeiModel> {
    const queryResultSei = await client.query<SeiModel>('select * from Sei where Processo = @p0', [nup])
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