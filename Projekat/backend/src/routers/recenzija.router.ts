import express from "express";
import { RecenzijaController } from "../controllers/recenzija.controller";
const recenzijaRouter = express.Router();

recenzijaRouter
  .route("/ostaviRecenziju")
  .post((req, res) => new RecenzijaController().ostaviRecenziju(req, res));

recenzijaRouter
  .route("/dohvatiSveRecenzijeZaKorisnika")
  .post((req, res) => new RecenzijaController().dohvatiSveRecenzijeZaKorisnika(req, res));

recenzijaRouter
  .route("/dohvatiProsecnuOcenuZaVikendicu")
  .post((req, res) => new RecenzijaController().dohvatiProsecnuOcenuZaVikendicu(req, res));

recenzijaRouter
  .route("/dohvatiRecenzijeZaVikendicu")
  .post((req, res) => new RecenzijaController().dohvatiRecenzijeZaVikendicu(req, res));

export default recenzijaRouter;