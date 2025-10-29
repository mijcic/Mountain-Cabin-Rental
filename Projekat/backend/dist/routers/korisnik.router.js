"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const korisnik_controller_1 = require("../controllers/korisnik.controller");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const userRouter = express_1.default.Router();
userRouter
    .route("/proveriKorisnickoIme")
    .post((req, res) => new korisnik_controller_1.KorisnikController().proveriKorisnickoIme(req, res));
userRouter
    .route("/proveriEmailAdresu")
    .post((req, res) => new korisnik_controller_1.KorisnikController().proveriEmailAdresu(req, res));
userRouter
    .route("/login")
    .post((req, res) => new korisnik_controller_1.KorisnikController().login(req, res));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path_1.default.extname(file.originalname))
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 300 * 1024 }, // maksimalna velicina 300x300px
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname)
            return cb(null, true);
        else {
            req.fileValidationError = "Dozvoljeni su samo JPG i PNG formati!";
            cb(null, false);
        }
    }
});
userRouter
    .route("/register")
    .post(upload.single("profilna_slika"), (req, res) => new korisnik_controller_1.KorisnikController().register(req, res));
userRouter
    .route("/proveriLozinku")
    .post((req, res) => new korisnik_controller_1.KorisnikController().proveriLozinku(req, res));
userRouter
    .route("/promeniLozinkuKorisniku")
    .post((req, res) => new korisnik_controller_1.KorisnikController().promeniLozinkuKorisniku(req, res));
userRouter
    .route("/azurirajSlikuZaKorisnika")
    .post(upload.single("profilna_slika"), (req, res) => new korisnik_controller_1.KorisnikController().azurirajSlikuZaKorisnika(req, res));
userRouter
    .route("/azurirajImeZaKorisnika")
    .post((req, res) => new korisnik_controller_1.KorisnikController().azurirajImeZaKorisnika(req, res));
userRouter
    .route("/azurirajPrezimeZaKorisnika")
    .post((req, res) => new korisnik_controller_1.KorisnikController().azurirajPrezimeZaKorisnika(req, res));
userRouter
    .route("/azurirajAdresuZaKorisnika")
    .post((req, res) => new korisnik_controller_1.KorisnikController().azurirajAdresuZaKorisnika(req, res));
userRouter
    .route("/azurirajTelefonZaKorisnika")
    .post((req, res) => new korisnik_controller_1.KorisnikController().azurirajTelefonZaKorisnika(req, res));
userRouter
    .route("/azurirajEMailZaKorisnika")
    .post((req, res) => new korisnik_controller_1.KorisnikController().azurirajEMailZaKorisnika(req, res));
userRouter
    .route("/azurirajCCNZaKorisnika")
    .post((req, res) => new korisnik_controller_1.KorisnikController().azurirajCCNZaKorisnika(req, res));
userRouter
    .route("/dohvatiUkupanBrojVlasnika")
    .get((req, res) => new korisnik_controller_1.KorisnikController().dohvatiUkupanBrojVlasnika(req, res));
userRouter
    .route("/dohvatiUkupanBrojTurista")
    .get((req, res) => new korisnik_controller_1.KorisnikController().dohvatiUkupanBrojTurista(req, res));
userRouter
    .route("/dohvatiSveVlasnike")
    .get((req, res) => new korisnik_controller_1.KorisnikController().dohvatiSveVlasnike(req, res));
userRouter
    .route("/dohvatiSveTuriste")
    .get((req, res) => new korisnik_controller_1.KorisnikController().dohvatiSveTuriste(req, res));
userRouter
    .route("/izmeniKorisnika")
    .post(upload.single("profilna_slika"), (req, res) => new korisnik_controller_1.KorisnikController().izmeniKorisnika(req, res));
userRouter
    .route("/obrisiKorisnika")
    .post((req, res) => new korisnik_controller_1.KorisnikController().obrisiKorisnika(req, res));
userRouter
    .route("/deaktivirajKorisnika")
    .post((req, res) => new korisnik_controller_1.KorisnikController().deaktivirajKorisnika(req, res));
exports.default = userRouter;
