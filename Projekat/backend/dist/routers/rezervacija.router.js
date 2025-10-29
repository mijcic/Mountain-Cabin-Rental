"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rezervacija_controller_1 = require("../controllers/rezervacija.controller");
const rezervacijaRouter = express_1.default.Router();
rezervacijaRouter
    .route("/dodajRezervaciju")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().dodajRezervaciju(req, res));
rezervacijaRouter
    .route("/dohvatiBrojRezervacijaUPoslednjih24h")
    .get((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiBrojRezervacijaUPoslednjih24h(req, res));
rezervacijaRouter
    .route("/dohvatiBrojRezervacijaUPoslednjih7Dana")
    .get((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiBrojRezervacijaUPoslednjih7Dana(req, res));
rezervacijaRouter
    .route("/dohvatiBrojRezervacijaUPoslednjih30Dana")
    .get((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiBrojRezervacijaUPoslednjih30Dana(req, res));
rezervacijaRouter
    .route("/dohvatiAktivneRezervacijeZaKorisnika")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiAktivneRezervacijeZaKorisnika(req, res));
rezervacijaRouter
    .route("/dohvatiNeobradjeneRezervacijeZaMojeVikendice")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiNeobradjeneRezervacijeZaMojeVikendice(req, res));
rezervacijaRouter
    .route("/potvrdiRezervaciju")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().potvrdiRezervaciju(req, res));
rezervacijaRouter
    .route("/odbijRezervaciju")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().odbijRezervaciju(req, res));
rezervacijaRouter
    .route("/odbijRezervacijeZaVikendicu")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().odbijRezervacijeZaVikendicu(req, res));
rezervacijaRouter
    .route("/dohvatiArhiviraneRezervacijeZaKorisnika")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiArhiviraneRezervacijeZaKorisnika(req, res));
rezervacijaRouter
    .route("/otkaziRezervaciju")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().otkaziRezervaciju(req, res));
rezervacijaRouter
    .route("/dohvatiSveRezervacijeZaMojeVikendice")
    .post((req, res) => new rezervacija_controller_1.RezervacijaController().dohvatiSveRezervacijeZaMojeVikendice(req, res));
exports.default = rezervacijaRouter;
