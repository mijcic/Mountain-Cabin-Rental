import express from "express";
import { RezervacijaController } from "../controllers/rezervacija.controller";
const rezervacijaRouter = express.Router();

rezervacijaRouter
  .route("/dodajRezervaciju")
  .post((req, res) => new RezervacijaController().dodajRezervaciju(req, res));

rezervacijaRouter
  .route("/dohvatiBrojRezervacijaUPoslednjih24h")
  .get((req, res) => new RezervacijaController().dohvatiBrojRezervacijaUPoslednjih24h(req, res));

rezervacijaRouter
  .route("/dohvatiBrojRezervacijaUPoslednjih7Dana")
  .get((req, res) => new RezervacijaController().dohvatiBrojRezervacijaUPoslednjih7Dana(req, res));

rezervacijaRouter
  .route("/dohvatiBrojRezervacijaUPoslednjih30Dana")
  .get((req, res) => new RezervacijaController().dohvatiBrojRezervacijaUPoslednjih30Dana(req, res));

rezervacijaRouter
  .route("/dohvatiAktivneRezervacijeZaKorisnika")
  .post((req, res) => new RezervacijaController().dohvatiAktivneRezervacijeZaKorisnika(req, res));

rezervacijaRouter
  .route("/dohvatiNeobradjeneRezervacijeZaMojeVikendice")
  .post((req, res) => new RezervacijaController().dohvatiNeobradjeneRezervacijeZaMojeVikendice(req, res));

rezervacijaRouter
  .route("/potvrdiRezervaciju")
  .post((req, res) => new RezervacijaController().potvrdiRezervaciju(req, res));

rezervacijaRouter
  .route("/odbijRezervaciju")
  .post((req, res) => new RezervacijaController().odbijRezervaciju(req, res));

rezervacijaRouter
  .route("/odbijRezervacijeZaVikendicu")
  .post((req, res) => new RezervacijaController().odbijRezervacijeZaVikendicu(req, res));

rezervacijaRouter
  .route("/dohvatiArhiviraneRezervacijeZaKorisnika")
  .post((req, res) => new RezervacijaController().dohvatiArhiviraneRezervacijeZaKorisnika(req, res));

rezervacijaRouter
  .route("/otkaziRezervaciju")
  .post((req, res) => new RezervacijaController().otkaziRezervaciju(req, res));

rezervacijaRouter
  .route("/dohvatiSveRezervacijeZaMojeVikendice")
  .post((req, res) => new RezervacijaController().dohvatiSveRezervacijeZaMojeVikendice(req, res));

export default rezervacijaRouter;