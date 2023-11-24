"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
const pg_1 = require("pg");
const client = new pg_1.Client({
    host: 'db.lzewbpgabqxqprhvdtxi.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'NFhXQLSDDKSjWyMf',
});
class Db {
    async insereProcesso(processoModel) {
        throw new Error('Method not implemented.');
    }
    async insereSei(seiModel, processoId) {
        throw new Error('Method not implemented.');
    }
    async buscaProcesso(numeroProcesso) {
        await client.connect();
        const t = await client.query('select * from Processo');
        console.log(t);
        return t.rows[0];
    }
    async buscaProcessoPorNup(nup) {
        throw new Error('Method not implemented.');
    }
    async buscaSei(nup) {
        throw new Error('Method not implemented.');
    }
    async deletaDependenciasProcesso(processoId) {
        throw new Error('Method not implemented.');
    }
    async deletaDependenciasSei(seiId) {
        throw new Error('Method not implemented.');
    }
}
exports.Db = Db;
