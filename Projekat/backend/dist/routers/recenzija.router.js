"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recenzija_controller_1 = require("../controllers/recenzija.controller");
const recenzijaRouter = express_1.default.Router();
recenzijaRouter
    .route("/ostaviRecenziju")
    .post((req, res) => new recenzija_controller_1.RecenzijaController().ostaviRecenziju(req, res));
recenzijaRouter
    .route("/dohvatiSveRecenzijeZaKorisnika")
    .post((req, res) => new recenzija_controller_1.RecenzijaController().dohvatiSveRecenzijeZaKorisnika(req, res));
recenzijaRouter
    .route("/dohvatiProsecnuOcenuZaVikendicu")
    .post((req, res) => new recenzija_controller_1.RecenzijaController().dohvatiProsecnuOcenuZaVikendicu(req, res));
recenzijaRouter
    .route("/dohvatiRecenzijeZaVikendicu")
    .post((req, res) => new recenzija_controller_1.RecenzijaController().dohvatiRecenzijeZaVikendicu(req, res));
exports.default = recenzijaRouter;
