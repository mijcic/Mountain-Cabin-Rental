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
exports.ZahteviController = void 0;
const zahtevRegistracija_1 = __importDefault(require("../models/zahtevRegistracija"));
const korisnik_1 = __importDefault(require("../models/korisnik"));
class ZahteviController {
    constructor() {
        this.dohvatiSveZahteveNaCekanju = (req, res) => {
            zahtevRegistracija_1.default.find({ status: "na_cekanju" }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.prihvatiZahtev = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.fileValidationError) {
                res.json({ poruka: req.fileValidationError });
                return;
            }
            let korisnicko_ime = req.body.korisnicko_ime;
            let lozinka = req.body.lozinka;
            let tip = req.body.tip;
            let ime = req.body.ime;
            let prezime = req.body.prezime;
            let pol = req.body.pol;
            let adresa = req.body.adresa;
            let kontakt_telefon = req.body.kontakt_telefon;
            let mejl = req.body.mejl;
            let broj_kreditne_kartice = req.body.broj_kreditne_kartice;
            let profilna_slika;
            // if (req.file) {
            //     profilna_slika = req.file.filename;
            // } 
            // else {
            //     profilna_slika = 'default_user_photo.jpg';
            // }
            if (req.body) {
                profilna_slika = req.body.profilna_slika;
            }
            else {
                profilna_slika = 'default_user_photo.jpg';
            }
            korisnik_1.default.findOne({ korisnicko_ime: korisnicko_ime }).then((data) => {
                if (data) {
                    res.json({ poruka: "Korisnik sa ovim korisnickom imenom vec postoji, pa nije moguce odobriti zahtev!" });
                    return;
                }
                else {
                    korisnik_1.default.findOne({ mejl: mejl }).then((data1) => {
                        if (data1) {
                            res.json({ poruka: "Korisnik sa ovim mejlom vec postoji, pa nije moguce odobriti zahtev!" });
                            return;
                        }
                        else {
                            korisnik_1.default.findOne({ korisnicko_ime: korisnicko_ime, mejl: mejl }).then((data2) => __awaiter(this, void 0, void 0, function* () {
                                if (data2) {
                                    res.json({ poruka: "Korisnik sa ovim korisnickim imenom i mejlom vec postoji, pa nije moguce odobriti zahtev!" });
                                    return;
                                }
                                else {
                                    yield zahtevRegistracija_1.default.updateOne({ korisnicko_ime: korisnicko_ime }, { status: "prihvacen" }).then(data => {
                                        new korisnik_1.default({ korisnicko_ime: korisnicko_ime, lozinka: lozinka, tip: tip, ime: ime, prezime: prezime, pol: pol,
                                            adresa: adresa, kontakt_telefon: kontakt_telefon, mejl: mejl, profilna_slika: profilna_slika,
                                            broj_kreditne_kartice: broj_kreditne_kartice, status: 'aktivan' }).save().then(data3 => {
                                            if (data3) {
                                                res.json({ poruka: "Zahtev za registraciju je odobren!" });
                                            }
                                            else {
                                                res.json({ poruka: "Zahtev za registraciju nije odobren!" });
                                            }
                                        }).catch(err => {
                                            console.log(err);
                                            res.json(err);
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                        res.json(err);
                                    });
                                }
                            }));
                        }
                    });
                }
            });
        });
        this.odbijZahtev = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            zahtevRegistracija_1.default.updateOne({ korisnicko_ime: korisnicko_ime }, { status: "odbijen" }).then(data => {
                res.json({ poruka: "Zahtev uspesno odbijen!" });
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
    }
}
exports.ZahteviController = ZahteviController;
