import express from "express";
import { KorisnikController } from "../controllers/korisnik.controller";
import multer from "multer";
import path from "path";
const userRouter = express.Router();

userRouter
  .route("/proveriKorisnickoIme")
  .post((req, res) => new KorisnikController().proveriKorisnickoIme(req, res));

userRouter
  .route("/proveriEmailAdresu")
  .post((req, res) => new KorisnikController().proveriEmailAdresu(req, res));

userRouter
  .route("/login")
  .post((req, res) => new KorisnikController().login(req, res));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 }, // maksimalna velicina 300x300px
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    else {
      (req as any).fileValidationError = "Dozvoljeni su samo JPG i PNG formati!";
      cb(null, false); 
    }
  }
});

userRouter
  .route("/register")
  .post(upload.single("profilna_slika"), (req, res) => new KorisnikController().register(req, res));

userRouter
  .route("/proveriLozinku")
  .post((req, res) => new KorisnikController().proveriLozinku(req, res));

userRouter
  .route("/promeniLozinkuKorisniku")
  .post((req, res) => new KorisnikController().promeniLozinkuKorisniku(req, res));

userRouter
  .route("/azurirajSlikuZaKorisnika")
  .post(upload.single("profilna_slika"), (req, res) => new KorisnikController().azurirajSlikuZaKorisnika(req, res));

userRouter
  .route("/azurirajImeZaKorisnika")
  .post((req, res) => new KorisnikController().azurirajImeZaKorisnika(req, res));

userRouter
  .route("/azurirajPrezimeZaKorisnika")
  .post((req, res) => new KorisnikController().azurirajPrezimeZaKorisnika(req, res));

userRouter
  .route("/azurirajAdresuZaKorisnika")
  .post((req, res) => new KorisnikController().azurirajAdresuZaKorisnika(req, res));

userRouter
  .route("/azurirajTelefonZaKorisnika")
  .post((req, res) => new KorisnikController().azurirajTelefonZaKorisnika(req, res));

userRouter
  .route("/azurirajEMailZaKorisnika")
  .post((req, res) => new KorisnikController().azurirajEMailZaKorisnika(req, res));

userRouter
  .route("/azurirajCCNZaKorisnika")
  .post((req, res) => new KorisnikController().azurirajCCNZaKorisnika(req, res));

userRouter
  .route("/dohvatiUkupanBrojVlasnika")
  .get((req, res) => new KorisnikController().dohvatiUkupanBrojVlasnika(req, res));

userRouter
  .route("/dohvatiUkupanBrojTurista")
  .get((req, res) => new KorisnikController().dohvatiUkupanBrojTurista(req, res));

userRouter
  .route("/dohvatiSveVlasnike")
  .get((req, res) => new KorisnikController().dohvatiSveVlasnike(req, res));

userRouter
  .route("/dohvatiSveTuriste")
  .get((req, res) => new KorisnikController().dohvatiSveTuriste(req, res));

userRouter
  .route("/izmeniKorisnika")
  .post(upload.single("profilna_slika"), (req, res) => new KorisnikController().izmeniKorisnika(req, res));

userRouter
  .route("/obrisiKorisnika")
  .post((req, res) => new KorisnikController().obrisiKorisnika(req, res));

userRouter
  .route("/deaktivirajKorisnika")
  .post((req, res) => new KorisnikController().deaktivirajKorisnika(req, res));

export default userRouter;