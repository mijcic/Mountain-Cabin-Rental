import express from "express";
import multer from "multer";
import path from "path";
import { VikendicaController } from "../controllers/vikendica.controller";
const vikendicaRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "vikendice_uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

vikendicaRouter
  .route("/dodajVikendicu")
  .post(upload.array("slike"), (req, res) => new VikendicaController().dodajVikendicu(req, res));

vikendicaRouter
  .route("/sveVikendice")
  .get((req, res) => new VikendicaController().sveVikendice(req, res));

vikendicaRouter
  .route("/dohvatiVikendicuPoNazivu")
  .post((req, res) => new VikendicaController().dohvatiVikendicuPoNazivu(req, res));

vikendicaRouter
  .route("/dohvatiUkupanBrojVikendica")
  .get((req, res) => new VikendicaController().dohvatiUkupanBrojVikendica(req, res));

vikendicaRouter
  .route("/dohvatiSveMojeVikendice")
  .post((req, res) => new VikendicaController().dohvatiSveMojeVikendice(req, res));

vikendicaRouter
  .route("/obrisiVikendicu")
  .post((req, res) => new VikendicaController().obrisiVikendicu(req, res));

vikendicaRouter
  .route("/izmeniVikendicu")
  .post(upload.array("slike"), (req, res) => new VikendicaController().izmeniVikendicu(req, res));

vikendicaRouter
  .route("/dohvatiVikendiceSaLosimOcenama")
  .get((req, res) => new VikendicaController().dohvatiVikendiceSaLosimOcenama(req, res));

vikendicaRouter
  .route("/blokirajVikendicu")
  .post((req, res) => new VikendicaController().blokirajVikendicu(req, res));

vikendicaRouter
  .route("/odblokirajPotrebneVikendice")
  .get((req, res) => new VikendicaController().odblokirajPotrebneVikendice(req, res));

export default vikendicaRouter;