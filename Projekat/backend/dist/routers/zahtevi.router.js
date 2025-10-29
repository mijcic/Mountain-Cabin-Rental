"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zahtevi_controller_1 = require("../controllers/zahtevi.controller");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const zahteviRouter = express_1.default.Router();
zahteviRouter
    .route("/dohvatiSveZahteveNaCekanju")
    .get((req, res) => new zahtevi_controller_1.ZahteviController().dohvatiSveZahteveNaCekanju(req, res));
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
zahteviRouter
    .route("/prihvatiZahtev")
    .post(upload.single("profilna_slika"), (req, res) => new zahtevi_controller_1.ZahteviController().prihvatiZahtev(req, res));
zahteviRouter
    .route("/odbijZahtev")
    .post((req, res) => new zahtevi_controller_1.ZahteviController().odbijZahtev(req, res));
exports.default = zahteviRouter;
