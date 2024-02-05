import { IDb } from '../interfaces/IDb'
import { CondicoesPropriedadeSolo } from '../models/CondicoesPropriedadeSolo'
import { DocumentoProcesso } from '../models/DocumentoProcesso'
import { Evento } from '../models/Evento'
import { Municipio } from '../models/Municipio'
import { PessoaRelacionada } from '../models/PessoaRelacionada'
import { ProcessoAssociado } from '../models/ProcessoAssociado'
import { Processo } from '../models/Processo'
import { Sei } from '../models/Sei'
import { Client } from 'pg'
import { Substancia } from '../models/Substancia'
import { Titulo } from '../models/Titulo'
import { Andamento, createAndamento } from '../models/Andamento'
import { Protocolo } from '../models/Protocolo'
import { uuid } from './Utils'
import { Ibama, createIbama } from '../models/Ibama'

export class Db implements IDb {
  async conectar(): Promise<Client> {
    const client = new Client(process.env.DATABASE_URL)
    await client.connect()
    return client
  }
  async desconectar(client: Client): Promise<void> {
    await client.end()
  }
  async insereProcesso(client: Client, processo: Processo, processoId: string): Promise<Processo> {
    await client.query(`
      insert into "Processo" ("Id", "NumeroProcesso", "NUP", "Area", "TipoRequerimento", "FaseAtual", "Ativo", "Superintendencia", "UF", "UnidadeProtocolizadora", "DataProtocolo", "DataPrioridade", "NumeroProcessoCadastroEmpresa", "Link")
      values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
    `, [processoId || uuid(), processo.NumeroProcesso, processo.NUP, processo.Area, processo.TipoRequerimento, processo.FaseAtual, processo.Ativo, processo.Superintendencia, processo.UF, processo.UnidadeProtocolizadora, processo.DataProtocolo, processo.DataPrioridade, processo.NumeroProcessoCadastroEmpresa, processo.Link])
    const queryResultProcessos = await client.query<Processo>(`select * from "Processo" where "NumeroProcesso" = '${processo.NumeroProcesso}'`)
    let novoProcesso = queryResultProcessos.rows[0]
    novoProcesso.PessoasRelacionadas = await this.inserePessoasRelacionadas(client, processo.PessoasRelacionadas, novoProcesso.Id)
    novoProcesso.Titulos = await this.insereTitulos(client, processo.Titulos, novoProcesso.Id)
    novoProcesso.Substancias = await this.insereSubstancias(client, processo.Substancias, novoProcesso.Id)
    novoProcesso.Municipios = await this.insereMunicipios(client, processo.Municipios, novoProcesso.Id)
    novoProcesso.CondicoesPropriedadeSolo = await this.insereCondicoesPropriedadeSolo(client, processo.CondicoesPropriedadeSolo, novoProcesso.Id)
    novoProcesso.ProcessosAssociados = await this.insereProcessosAssociados(client, processo.ProcessosAssociados, novoProcesso.Id)
    novoProcesso.DocumentosProcesso = await this.insereDocumentosProcesso(client, processo.DocumentosProcesso, novoProcesso.Id)
    novoProcesso.Eventos = await this.insereEventos(client, processo.Eventos, novoProcesso.Id)
    return novoProcesso
  }
  async inserePessoasRelacionadas(client: Client, pessoasRelacionadas?: PessoaRelacionada[], processoId?: string): Promise<PessoaRelacionada[]> {
    if (!pessoasRelacionadas?.length) return []
    const sql = 'insert into "PessoaRelacionada" ("Id", "TipoRelacao", "CpfCnpj", "Nome", "ResponsabilidadeRepresentacao", "PrazoArrendamento", "DataInicio", "DataFinal", "DataCriacao", "ProcessoId") values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
    for (const pessoaRelacionada of pessoasRelacionadas) await client.query<PessoaRelacionada>(sql, [uuid(), pessoaRelacionada.TipoRelacao, pessoaRelacionada.CpfCnpj, pessoaRelacionada.Nome, pessoaRelacionada.ResponsabilidadeRepresentacao, pessoaRelacionada.PrazoArrendamento, pessoaRelacionada.DataInicio, pessoaRelacionada.DataFinal, pessoaRelacionada.DataCriacao, processoId])
    const queryResultPessoaRelacionada = await client.query<PessoaRelacionada>('select * from "PessoaRelacionada" where "ProcessoId" = $1', [processoId])
    return queryResultPessoaRelacionada.rows
  }
  async insereCondicoesPropriedadeSolo(client: Client, condicoesPropriedadeSolo?: CondicoesPropriedadeSolo[], processoId?: string): Promise<CondicoesPropriedadeSolo[]> {
    if (!condicoesPropriedadeSolo?.length) return []
    const sql = 'insert into "CondicaoPropriedadeSolo" ("Id", "Tipo", "DataCriacao", "ProcessoId") values($1, $2, $3, $4)'
    for (const condicaoPropriedadeSolo of condicoesPropriedadeSolo) await client.query<CondicoesPropriedadeSolo>(sql, [uuid(), condicaoPropriedadeSolo.Tipo, condicaoPropriedadeSolo.DataCriacao, processoId])
    const queryResultCondicoesPropriedadeSolo = await client.query<CondicoesPropriedadeSolo>('select * from "CondicaoPropriedadeSolo" where "ProcessoId" = $1', [processoId])
    return queryResultCondicoesPropriedadeSolo.rows
  }
  async insereDocumentosProcesso(client: Client, documentosProcesso?: DocumentoProcesso[], processoId?: string): Promise<DocumentoProcesso[]> {
    if (!documentosProcesso?.length) return []
    const sql = 'insert into "DocumentoProcesso" ("Id", "Documento", "DataProtocolo", "DataCriacao", "ProcessoId") values($1, $2, $3, $4, $5)'
    for (const documentoProcesso of documentosProcesso) await client.query<DocumentoProcesso>(sql, [uuid(), documentoProcesso.Documento, documentoProcesso.DataProtocolo, documentoProcesso.DataCriacao, processoId])
    const queryResultDocumentoProcesso = await client.query<DocumentoProcesso>('select * from "CondicaoPropriedadeSolo" where "ProcessoId" = $1', [processoId])
    return queryResultDocumentoProcesso.rows
  }
  async insereTitulos(client: Client, titulos?: Titulo[], processoId?: string): Promise<Titulo[]> {
    if (!titulos?.length) return []
    const sql = 'insert into "Titulo" ("Id", "Numero", "Descricao", "TipoTitulo", "SituacaoTitulo", "DataPublicacao", "DataVencimento", "DataCriacao", "ProcessoId") values($1, $2, $3, $4, $5, $6, $7, $8, $9)'
    for (const titulo of titulos) await client.query<Titulo>(sql, [uuid(), titulo.Numero, titulo.Descricao, titulo.TipoTitulo, titulo.SituacaoTitulo, titulo.DataPublicacao, titulo.DataVencimento, titulo.DataCriacao, processoId])
    const queryResultTitulo = await client.query<Titulo>('select * from "Titulo" where "ProcessoId" = $1', [processoId])
    return queryResultTitulo.rows
  }
  async insereEventos(client: Client, eventos?: Evento[], processoId?: string): Promise<Evento[]> {
    if (!eventos?.length) return []
    const sql = 'insert into "Evento" ("Id", "Descricao", "Data", "DataCriacao", "ProcessoId") values($1, $2, $3, $4, $5)'
    for (const evento of eventos) await client.query<Evento>(sql, [uuid(), evento.Descricao, evento.Data, evento.DataCriacao, processoId])
    const queryResultEvento = await client.query<Evento>('select * from "Evento" where "ProcessoId" = $1', [processoId])
    return queryResultEvento.rows
  }
  async insereMunicipios(client: Client, municipios?: Municipio[], processoId?: string): Promise<Municipio[]> {
    if (!municipios?.length) return []
    const sql = 'insert into "Municipio" ("Id", "Nome", "DataCriacao", "ProcessoId") values($1, $2, $3, $4)'
    for (const municipio of municipios) await client.query<Municipio>(sql, [uuid(), municipio.Nome, municipio.DataCriacao, processoId])
    const queryResultMunicipio = await client.query<Municipio>('select * from "Municipio" where "ProcessoId" = $1', [processoId])
    return queryResultMunicipio.rows
  }
  async insereProcessosAssociados(client: Client, processosAssociados?: ProcessoAssociado[], processoId?: string): Promise<ProcessoAssociado[]> {
    if (!processosAssociados?.length) return []
    const sql = 'insert into "ProcessoAssociado" ("Id", "Processo", "Titular", "TipoAssociacao", "DataAssociacao", "DataDesassociacao", "ProcessoOriginal", "Observacao", "Link", "DataCriacao", "ProcessoId") values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)'
    for (const processoAssociado of processosAssociados) await client.query<ProcessoAssociado>(sql, [uuid(), processoAssociado.Processo, processoAssociado.Titular, processoAssociado.TipoAssociacao, processoAssociado.DataAssociacao, processoAssociado.DataDesassociacao, processoAssociado.ProcessoOriginal, processoAssociado.Observacao, processoAssociado.Link, processoAssociado.DataCriacao, processoId])
    const queryResultProcessoAssociado = await client.query<ProcessoAssociado>('select * from "ProcessoAssociado" where "ProcessoId" = $1', [processoId])
    return queryResultProcessoAssociado.rows
  }
  async insereSubstancias(client: Client, substancias?: Substancia[], processoId?: string): Promise<Substancia[]> {
    if (!substancias?.length) return []
    const sql = 'insert into "Substancia" ("Id", "Nome", "TipoUso", "DataInicio", "DataFinal", "MotivoEncerramento", "DataCriacao", "ProcessoId") values($1, $2, $3, $4, $5, $6, $7, $8)'
    for (const substancia of substancias) await client.query<Substancia>(sql, [uuid(), substancia.Nome, substancia.TipoUso, substancia.DataInicio, substancia.DataFinal, substancia.MotivoEncerramento, substancia.DataCriacao, processoId])
    const queryResultSubstancia = await client.query<Substancia>('select * from "Substancia" where "ProcessoId" = $1', [processoId])
    return queryResultSubstancia.rows
  }
  async insereSei(client: Client, sei: Sei, processoId?: string): Promise<Sei> {
    let sql = `
      insert into "Sei" ("Id", "Processo", "Tipo", "DataRegistro", "Interessados", "Link", "ProcessoId")
      select $1, $2, $3, $4, $5, $6, $7
      where not exists(
        select 1
        from "Sei"
        where "Processo" = $2
      )
    `
    await client.query(sql, [uuid(), sei.Processo, sei.Tipo, sei.DataRegistro, sei.Interessados, sei.Link, processoId])

    sql = `
      select *
      from "Sei"
      where "Processo" = $1
    `
    const seiDb = (await client.query<Sei>(sql, [sei.Processo])).rows[0]

    if (sei.Andamentos?.length) {
      seiDb.Andamentos = await this.insereAndamentos(client, sei.Andamentos, seiDb.Id)
    }
    if (sei.Protocolos?.length) {
      seiDb.Protocolos = await this.insereProtocolos(client, sei.Protocolos, seiDb.Id)
    }
    return seiDb
  }
  async insereProtocolos(client: Client, protocolos?: Protocolo[], seiId?: string): Promise<Protocolo[]> {
    if (!protocolos?.length) return []
    const sql = `
      insert into "Protocolo" ("Id", "DocumentoProcesso", "TipoDocumento", "DataDocumento", "DataRegistro", "Unidade", "Link", "DataCriacao", "SeiId")
      select $1, $2, $3, $4, $5, $6, $7, $8, $9
      where not exists(
        select 1
        from "Protocolo"
        where "DocumentoProcesso" = $2
        and "SeiId" = $9
      )
    `
    for (const protocolo of protocolos) await client.query<Protocolo>(sql, [uuid(), protocolo.DocumentoProcesso, protocolo.TipoDocumento, protocolo.DataDocumento, protocolo.DataRegistro, protocolo.Unidade, protocolo.Link, new Date(), seiId])
    const queryResultProtocolo = await client.query<Protocolo>('select * from "Protocolo" where "SeiId" = $1', [seiId])
    return queryResultProtocolo.rows
  }
  async insereAndamentos(client: Client, andamentos?: Andamento[], seiId?: string): Promise<Andamento[]> {
    if (!andamentos?.length) return []
    const sql = `
      insert into "Andamento" ("Id", "DataHora", "Unidade", "Descricao", "DataCriacao", "SeiId")
      select $1, $2, $3, $4, $5, $6
      where not exists(
        select 1
        from "Andamento"
        where "DataHora" = $2
        and "Unidade" = $3
        and "Descricao" = $4
        and "SeiId" = $6
      )
    `
    for (const andamento of andamentos) await client.query<Andamento>(sql, [uuid(), andamento.DataHora, andamento.Unidade, andamento.Descricao, new Date(), seiId])
    const queryResultAndamento = await client.query<Andamento>('select * from "Andamento" where "SeiId" = $1', [seiId])
    return queryResultAndamento.rows
  }
  async buscaProcesso(client: Client, numeroProcesso: string): Promise<Processo | void> {
    const queryResultProcessos = await client.query(`
      select *
      from "Processo"
      where "NumeroProcesso" = $1
    `, [numeroProcesso])
  
    let processo: Processo = queryResultProcessos.rows[0]
    if (processo) {
      processo.CondicoesPropriedadeSolo = await this.buscarCondicoesPropriedadeSoloPorProcesso(client, processo.Id)
      processo.DocumentosProcesso = await this.buscarDocumentosProcessoPorProcesso(client, processo.Id)
      processo.Eventos = await this.buscarEventosPorProcesso(client, processo.Id)
      processo.Municipios = await this.buscarMunicipiosPorProcesso(client, processo.Id)
      processo.PessoasRelacionadas = await this.buscarPessoasRelacionadasPorProcesso(client, processo.Id)
      processo.ProcessosAssociados = await this.buscarProcessosAssociadosPorProcesso(client, processo.Id)
      processo.Substancias = await this.buscarSubstanciasPorProcesso(client, processo.Id)
      processo.Titulos = await this.buscarTitulosPorProcesso(client, processo.Id)
      return processo
    }
  }
  async buscarCondicoesPropriedadeSoloPorProcesso(client: Client, processoId?: string): Promise<CondicoesPropriedadeSolo[]> {
    const queryResultCondicoesPropriedadeSolo = await client.query<CondicoesPropriedadeSolo>('select * from "CondicaoPropriedadeSolo" where "ProcessoId" = $1', [processoId])
    return queryResultCondicoesPropriedadeSolo.rows
  }
  async buscarDocumentosProcessoPorProcesso(client: Client, processoId?: string): Promise<DocumentoProcesso[]> {
    const queryResultDocumentosProcesso = await client.query<DocumentoProcesso>('select * from "DocumentoProcesso" where "ProcessoId" = $1', [processoId])
    return queryResultDocumentosProcesso.rows
  }
  async buscarEventosPorProcesso(client: Client, processoId?: string): Promise<Evento[]> {
    const queryResultEventos = await client.query<Evento>('select * from "Evento" where "ProcessoId" = $1', [processoId])
    return queryResultEventos.rows
  }
  async buscarMunicipiosPorProcesso(client: Client, processoId?: string): Promise<Municipio[]> {
    const queryResultMunicipios = await client.query<Municipio>('select * from "Municipio" where "ProcessoId" = $1', [processoId])
    return queryResultMunicipios.rows
  }
  async buscarPessoasRelacionadasPorProcesso(client: Client, processoId?: string): Promise<PessoaRelacionada[]> {
    const queryResultPessoasRelacionadas = await client.query<PessoaRelacionada>('select * from "PessoaRelacionada" where "ProcessoId" = $1', [processoId])
    return queryResultPessoasRelacionadas.rows
  }
  async buscarProcessosAssociadosPorProcesso(client: Client, processoId?: string): Promise<ProcessoAssociado[]> {
    const queryResultProcessosAssociados = await client.query<ProcessoAssociado>('select * from "ProcessoAssociado" where "ProcessoId" = $1', [processoId])
    return queryResultProcessosAssociados.rows
  }
  async buscarSubstanciasPorProcesso(client: Client, processoId?: string): Promise<Substancia[]> {
    const queryResultSubstancias = await client.query<Substancia>('select * from "Substancia" where "ProcessoId" = $1', [processoId])
    return queryResultSubstancias.rows
  }
  async buscarTitulosPorProcesso(client: Client, processoId?: string): Promise<Titulo[]> {
    const queryResultTitulos = await client.query<Titulo>('select * from "Titulo" where "ProcessoId" = $1', [processoId])
    return queryResultTitulos.rows
  }
  async buscaProcessoPorNup(client: Client, nup: string): Promise<Processo> {
    const queryResultProcessos = await client.query<Processo>('select * from "Processo" where "NUP" = $1', [nup])
    return queryResultProcessos.rows[0]
  }
  async buscaSei(client: Client, nup: string): Promise<Sei> {
    const sei = (await client.query<Sei>('select * from "Sei" where "Processo" = $1', [nup])).rows[0]
    
    return sei
  }
  async deletaProcesso(client: Client, processoId?: string): Promise<void> {
    await client.query(`
      delete from "CondicaoPropriedadeSolo" where "ProcessoId" = '${processoId}';
      delete from "DocumentoProcesso" where "ProcessoId" = '${processoId}';
      delete from "Evento" where "ProcessoId" = '${processoId}';
      delete from "Municipio" where "ProcessoId" = '${processoId}';
      delete from "PessoaRelacionada" where "ProcessoId" = '${processoId}';
      delete from "ProcessoAssociado" where "ProcessoId" = '${processoId}';
      delete from "Substancia" where "ProcessoId" = '${processoId}';
      delete from "Titulo" where "ProcessoId" = '${processoId}';
      delete from "Andamento" a where exists (select 3 from "Sei" s where a."SeiId" = s."Id" and s."ProcessoId" = '${processoId}');
      delete from "Protocolo" p where exists (select 3 from "Sei" s where p."SeiId" = s."Id" and s."ProcessoId" = '${processoId}');
      delete from "Processo" where "Id" = '${processoId}'`
    )
  }
  async deletaSei(client: Client,seiId: string): Promise<void> {
    await client.query(`
      delete from "Andamento" where "SeiId" = ${seiId}
      delete from "Protocolo" where "SeiId" = ${seiId}
      delete from "Sei" where "Id" = ${seiId}`
    )
  }
  async verificaProcessoExiste(client: Client, numeroProcesso: string): Promise<boolean> {
    const queryResultSei = await client.query<Sei>('select 1 from "Processo" where "NumeroProcesso" = $1', [numeroProcesso])
    return !!queryResultSei.rows[0]
  }
  async filtrar(client: Client, filtro: string): Promise<Processo[]> {
    filtro = filtro.replace('/', '').replace('.', '').replace(' ', '').toLowerCase()
    const processos = await client.query<Processo>(`
      select *
      from "Processo"
      where LOWER("NumeroProcesso") like $1 or LOWER("NomeCliente") like $1
      order by "NumeroProcesso" desc
    `, [`%${filtro}%`])
    return processos.rows
  }
  async buscaIbama(client: Client, cpfcnpj: string): Promise<Ibama | null> {
    cpfcnpj = cpfcnpj.replace('-', '').replace('.', '').replace('/', '').replace(' ', '')
    const ibamaResult = await client.query<Ibama>(`
      select *
      from "Ibama"
      where "CpfCnpj" = $1
    `, [cpfcnpj])
    return ibamaResult.rows[0]
  }
  async insereIbama (client: Client, ibama: Ibama, ibamaId?: string): Promise<Ibama> {
    if (!ibama) return {}
    ibama.CpfCnpj = ibama.CpfCnpj?.replace('-', '').replace('.', '').replace('/', '').replace(' ', '')
    await client.query<Ibama>(
      'insert into "Ibama" ("Id", "NumeroRegistro", "DataConsulta", "DataCR", "DataValidadeCR", "CpfCnpj", "RazaoSocial", "Descricao") values($1, $2, $3, $4, $5, $6, $7, $8)',
      [uuid(), ibama.NumeroRegistro, ibama.DataConsulta, ibama.DataCR, ibama.DataValidadeCR, ibama.CpfCnpj, ibama.RazaoSocial, ibama.Descricao])
    const queryResultIbama = await client.query<Ibama>('select * from "Ibama" where "CpfCnpj" = $1', [ibama.CpfCnpj])
    return queryResultIbama.rows[0]
  }
  async deletaIbama (client: Client, ibamaId: string): Promise<void> {
    await client.query(`delete from "Ibama" where "Id" = $1`, [ibamaId])
  }
}