"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const vikendica_controller_1 = require("../controllers/vikendica.controller");
const vikendicaRouter = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, "vikendice_uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path_1.default.extname(file.originalname))
});
const upload = (0, multer_1.default)({ storage });
vikendicaRouter
    .route("/dodajVikendicu")
    .post(upload.array("slike"), (req, res) => new vikendica_controller_1.VikendicaController().dodajVikendicu(req, res));
vikendicaRouter
    .route("/sveVikendice")
    .get((req, res) => new vikendica_controller_1.VikendicaController().sveVikendice(req, res));
vikendicaRouter
    .route("/dohvatiVikendicuPoNazivu")
    .post((req, res) => new vikendica_controller_1.VikendicaController().dohvatiVikendicuPoNazivu(req, res));
vikendicaRouter
    .route("/dohvatiUkupanBrojVikendica")
    .get((req, res) => new vikendica_controller_1.VikendicaController().dohvatiUkupanBrojVikendica(req, res));
vikendicaRouter
    .route("/dohvatiSveMojeVikendice")
    .post((req, res) => new vikendica_controller_1.VikendicaController().dohvatiSveMojeVikendice(req, res));
vikendicaRouter
    .route("/obrisiVikendicu")
    .post((req, res) => new vikendica_controller_1.VikendicaController().obrisiVikendicu(req, res));
vikendicaRouter
    .route("/izmeniVikendicu")
    .post(upload.array("slike"), (req, res) => new vikendica_controller_1.VikendicaController().izmeniVikendicu(req, res));
vikendicaRouter
    .route("/dohvatiVikendiceSaLosimOcenama")
    .get((req, res) => new vikendica_controller_1.VikendicaController().dohvatiVikendiceSaLosimOcenama(req, res));
vikendicaRouter
    .route("/blokirajVikendicu")
    .post((req, res) => new vikendica_controller_1.VikendicaController().blokirajVikendicu(req, res));
vikendicaRouter
    .route("/odblokirajPotrebneVikendice")
    .get((req, res) => new vikendica_controller_1.VikendicaController().odblokirajPotrebneVikendice(req, res));
exports.default = vikendicaRouter;
