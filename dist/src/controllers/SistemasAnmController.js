"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SistemasAnmController = void 0;
class SistemasAnmController {
    constructor(sistemasAnm, db) {
        this.buscaProcesso = async (req, res) => {
            try {
                const numeroProcesso = req.query.numeroProcesso;
                let processo = await this.db.buscaProcesso(numeroProcesso);
                if (processo)
                    return processo;
                else {
                    processo = await this.sistemasAnm.pegaProcesso(numeroProcesso);
                    processo = await this.db.insereProcesso(processo);
                }
                return res.status(200).send(processo);
            }
            catch (error) {
                if (error instanceof Error)
                    return res.status(400).send(error.message);
                else
                    return res.status(500).send('Internal Server Error');
            }
        };
        this.buscaProcessoEmLote = async (req, res) => {
            res.sendStatus(200);
        };
        this.sistemasAnm = sistemasAnm;
        this.db = db;
    }
}
exports.SistemasAnmController = SistemasAnmController;
