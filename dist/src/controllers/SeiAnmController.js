"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeiAnmController = void 0;
class SeiAnmController {
    constructor(seiAnm, db) {
        this.buscaSei = async (req, res) => {
            res.sendStatus(200);
        };
        this.buscaSeiEmLote = async (req, res) => {
            res.sendStatus(200);
        };
        this.seiAnm = seiAnm;
        this.db = db;
    }
}
exports.SeiAnmController = SeiAnmController;
