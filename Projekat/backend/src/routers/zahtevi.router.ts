import express from "express";
import { ZahteviController } from "../controllers/zahtevi.controller";
import multer from "multer";
import path from "path";
const zahteviRouter = express.Router();

zahteviRouter
  .route("/dohvatiSveZahteveNaCekanju")
  .get((req, res) => new ZahteviController().dohvatiSveZahteveNaCekanju(req, res));

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

zahteviRouter
  .route("/prihvatiZahtev")
  .post(upload.single("profilna_slika"), (req, res) => new ZahteviController().prihvatiZahtev(req, res));

zahteviRouter
  .route("/odbijZahtev")
  .post((req, res) => new ZahteviController().odbijZahtev(req, res));

export default zahteviRouter;