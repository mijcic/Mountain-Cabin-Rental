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
exports.VikendicaController = void 0;
const vikendica_1 = __importDefault(require("../models/vikendica"));
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
const recenzija_1 = __importDefault(require("../models/recenzija"));
class VikendicaController {
    constructor() {
        this.dodajVikendicu = (req, res) => {
            let naziv = req.body.naziv;
            let mesto = req.body.mesto;
            let usluge = req.body.usluge;
            let cenovnik_letnji = req.body.cenovnik_letnji;
            let cenovnik_zimski = req.body.cenovnik_zimski;
            let kontakt_telefon = req.body.kontakt_telefon;
            let koordinate = req.body.koordinate;
            let vlasnik = JSON.parse(req.body.vlasnik);
            const fajlovi = req.files;
            const slikePutanje = fajlovi.map(f => f.filename);
            vikendica_1.default.findOne({ naziv: naziv, mesto: mesto }).then((data) => __awaiter(this, void 0, void 0, function* () {
                if (data) {
                    res.json({ poruka: "Vikendica sa ovim imenom u ovom mestu vec postoji!" });
                }
                else {
                    let last = yield vikendica_1.default.findOne().sort({ id: -1 }).exec();
                    let newId = last ? last.id + 1 : 1;
                    new vikendica_1.default({ id: newId, naziv: naziv, mesto: mesto, usluge: usluge, cenovnik_letnji: cenovnik_letnji, cenovnik_zimski: cenovnik_zimski,
                        kontakt_telefon: kontakt_telefon, koordinate: koordinate, slike: slikePutanje, vlasnik: vlasnik, status: 'aktivna' }).save().then(data => {
                        if (data)
                            res.json({ poruka: "Uspesno dodata vikendica!" });
                        else
                            res.json({ poruka: "Neuspesno dodata vikendica!" });
                    }).catch(err => {
                        console.log(err);
                        res.json(err);
                    });
                }
            })).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.sveVikendice = (req, res) => {
            vikendica_1.default.find().populate('vlasnik').then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiVikendicuPoNazivu = (req, res) => {
            let naziv = req.body.naziv;
            vikendica_1.default.findOne({ naziv: naziv }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiUkupanBrojVikendica = (req, res) => {
            vikendica_1.default.countDocuments({}).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiSveMojeVikendice = (req, res) => {
            let vlasnik = req.body.vlasnik;
            vikendica_1.default.find({ vlasnik: vlasnik }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.obrisiVikendicu = (req, res) => {
            let id = req.body.id;
            vikendica_1.default.deleteOne({ id: id }).then(data => {
                if (data) {
                    res.json({ poruka: "Uspesno obrisana vikendica!" });
                }
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.izmeniVikendicu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let id = JSON.parse(req.body.id);
            let naziv = req.body.naziv;
            let mesto = req.body.mesto;
            let usluge = req.body.usluge;
            let cenovnik_letnji = req.body.cenovnik_letnji;
            let cenovnik_zimski = req.body.cenovnik_zimski;
            let kontakt_telefon = req.body.kontakt_telefon;
            let koordinate = req.body.koordinate;
            let vlasnik = JSON.parse(req.body.vlasnik);
            const fajlovi = req.files;
            const noveSlikePutanje = (_a = fajlovi === null || fajlovi === void 0 ? void 0 : fajlovi.map(f => f.filename)) !== null && _a !== void 0 ? _a : [];
            const slikePutanje = noveSlikePutanje.length > 0 ? noveSlikePutanje : req.body.slike;
            let vecPostoji = yield vikendica_1.default.findOne({ naziv: naziv, mesto: mesto });
            if (vecPostoji && id != vecPostoji.id) {
                res.json({ poruka: "Vikendica sa ovim nazivom u ovom mestu vec postoji!" });
            }
            else {
                vikendica_1.default.updateOne({ id: id }, { naziv: naziv, mesto: mesto, usluge: usluge, cenovnik_letnji: cenovnik_letnji, cenovnik_zimski: cenovnik_zimski,
                    kontakt_telefon: kontakt_telefon, koordinate: koordinate, slike: slikePutanje, vlasnik: vlasnik }).then(data => {
                    if (data)
                        res.json({ poruka: "Uspesno izmenjena vikendica!" });
                }).catch(err => {
                    console.log(err);
                    res.json(err);
                });
            }
        });
        this.dohvatiVikendiceSaLosimOcenama = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let vikendice = yield vikendica_1.default.find();
                let vikendiceRezultat = [];
                for (let vikendica of vikendice) {
                    let rezervacije = yield rezervacija_1.default.find({ vikendica: vikendica });
                    let niz = [];
                    for (let rezervacija of rezervacije) {
                        let recenzija = yield recenzija_1.default.findOne({ rezervacija: rezervacija }).populate('rezervacija');
                        niz.push(recenzija);
                    }
                    niz = niz
                        .filter(r => r && r.rezervacija && r.rezervacija.datum_rezervacije)
                        .sort((a, b) => new Date((b === null || b === void 0 ? void 0 : b.rezervacija).datum_rezervacije).getTime() -
                        new Date((a === null || a === void 0 ? void 0 : a.rezervacija).datum_rezervacije).getTime())
                        .slice(0, 3);
                    let poslednje3Ocene = niz.map(r => { var _a; return (_a = r === null || r === void 0 ? void 0 : r.ocena) !== null && _a !== void 0 ? _a : 0; });
                    if (poslednje3Ocene.length === 3 && poslednje3Ocene.every(o => o < 2)) {
                        vikendiceRezultat.push(vikendica);
                    }
                }
                res.json(vikendiceRezultat);
            }
            catch (err) {
                console.log(err);
                res.json(err);
            }
        });
        this.blokirajVikendicu = (req, res) => {
            let id = req.body.id;
            let danasnjiDatum = new Date();
            let datum_odblokiranja = new Date(danasnjiDatum.getTime() + 48 * 60 * 60 * 1000);
            vikendica_1.default.updateOne({ id: id }, { $set: { datum_odblokiranja: datum_odblokiranja, status: 'blokirana' } }).then(data => {
                if (data.modifiedCount > 0) {
                    res.json({ poruka: "Uspesno blokirana vikendica!" });
                }
                else {
                    res.json({ poruka: "Greska prilikom blokiranja vikendice!" });
                }
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.odblokirajPotrebneVikendice = (req, res) => {
            let danasnjiDatum = new Date();
            vikendica_1.default.updateMany({ datum_odblokiranja: { $lte: danasnjiDatum }, status: 'blokirana' }, { $set: { status: "aktivna", datum_odblokiranja: null } }).then(data => {
                if (data.modifiedCount > 0) {
                    res.json({ poruka: "Uspesno odblokirane vikendice kojima je istekao period blokiranja!" });
                }
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
    }
}
exports.VikendicaController = VikendicaController;
