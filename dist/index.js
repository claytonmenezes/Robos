"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('passei');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const routes_1 = __importDefault(require("./src/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.default);
const port = process.env.PORT || 8090;
const start = async () => {
    try {
        app.listen(port, () => console.log(`Extração Processo Rodando na Porta ${port}`));
    }
    catch (error) {
        console.error(error);
    }
};
start();
