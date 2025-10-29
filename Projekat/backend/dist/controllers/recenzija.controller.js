"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecenzijaController = void 0;
const recenzija_1 = __importDefault(require("../models/recenzija"));
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
class RecenzijaController {
    constructor() {
        this.ostaviRecenziju = (req, res) => {
            let komentar = req.body.komentar;
            let ocena = req.body.ocena;
            let korisnik = req.body.korisnik;
            let rezervacija = req.body.rezervacija;
            new recenzija_1.default({ komentar: komentar, ocena: ocena, korisnik: korisnik, rezervacija: rezervacija, datum_ocenjivanja: new Date() }).save().then(data => {
                if (data)
                    res.json({ poruka: "Hvala Vam na oceni i izdvojenom vremenu!" });
                else
                    res.json({ poruka: "Neuspesno dodata recenzija!" });
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiSveRecenzijeZaKorisnika = (req, res) => {
            let korisnik = req.body.korisnik;
            recenzija_1.default.find({ korisnik: korisnik }).populate('rezervacija').then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiProsecnuOcenuZaVikendicu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let vikendica = req.body.vikendica;
                let rezervacijeZaVikendicu = yield rezervacija_1.default.find({ vikendica: vikendica });
                let recenzije = yield recenzija_1.default.find({ rezervacija: { $in: rezervacijeZaVikendicu } });
                let zbir = recenzije.reduce((sum, r) => sum + (r.ocena || 0), 0);
                let prosecna = zbir / recenzije.length;
                res.json(prosecna);
            }
            catch (err) {
                console.log(err);
                res.json(err);
            }
        });
        this.dohvatiRecenzijeZaVikendicu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let vikendica = req.body.vikendica;
            let rezervacijeZaVikendicu = yield rezervacija_1.default.find({ vikendica: vikendica });
            recenzija_1.default.find({ rezervacija: { $in: rezervacijeZaVikendicu } }).populate('korisnik').then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        });
    }
}
exports.RecenzijaController = RecenzijaController;
