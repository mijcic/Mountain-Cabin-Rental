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
exports.KorisnikController = void 0;
const korisnik_1 = __importDefault(require("../models/korisnik"));
const zahtevRegistracija_1 = __importDefault(require("../models/zahtevRegistracija"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// npm install multer
// npm install sharp
// npm install bcrypt
// npm install mongoose-sequence
// npm install bootstrap --save
// npm install leaflet
// npm install --save-dev @types/leaflet
// npm install @fullcalendar/angular @fullcalendar/daygrid @fullcalendar/interaction
// npm i --save-dev @types/bootstrap
// npm install @fullcalendar/angular@6 @fullcalendar/core@6 @fullcalendar/daygrid@6 @fullcalendar/interaction@6
// npm install @fullcalendar/core @fullcalendar/daygrid
// npm install @angular/cdk@18 @angular/material@18
// npm install chart.js@4.4.1 ng2-charts@6.0.0
class KorisnikController {
    constructor() {
        this.proveriKorisnickoIme = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            korisnik_1.default.findOne({ korisnicko_ime: korisnicko_ime })
                .then((user) => {
                if (user != null) {
                    res.json({ poruka: "Vec postoji!" });
                }
                else {
                    res.json({ poruka: "Korisnik sa ovim korisnickim imenom ne postoji!" });
                }
            })
                .catch((err) => console.log(err));
        };
        this.proveriEmailAdresu = (req, res) => {
            let mejl = req.body.mejl;
            korisnik_1.default.findOne({ mejl: mejl })
                .then((user) => {
                if (user != null) {
                    res.json({ poruka: "Vec postoji!" });
                }
                else {
                    res.json({ poruka: "Korisnik sa ovim korisnickim imenom ne postoji!" });
                }
            })
                .catch((err) => console.log(err));
        };
        this.login = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            let lozinka = req.body.lozinka;
            korisnik_1.default.findOne({ korisnicko_ime: korisnicko_ime })
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                if (user == null) {
                    res.json({ poruka: "Korisnik sa ovim korisnickim imenom ne postoji!" });
                }
                else {
                    if (user.lozinka) {
                        const match = yield bcrypt_1.default.compare(lozinka, user.lozinka);
                        if (!match) {
                            res.json({ poruka: "Lozinka nije tacna!" });
                        }
                        else {
                            if (user.status == 'neaktivan') {
                                res.json({ poruka: "Nalog je deaktiviran!" });
                            }
                            else {
                                res.json(user);
                            }
                        }
                    }
                }
            }))
                .catch((err) => console.log(err));
        };
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            if (req.file) {
                profilna_slika = req.file.filename;
            }
            else {
                profilna_slika = 'default_user_photo.jpg';
            }
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(lozinka, saltRounds);
            zahtevRegistracija_1.default.findOne({ korisnicko_ime: korisnicko_ime }).then((postojiZahtev1) => {
                if (postojiZahtev1) {
                    if (postojiZahtev1.status == "na_cekanju") {
                        res.json({ poruka: "Vas zahtev je na cekanju! Sacekajte da ga administrator odobri!" });
                        return;
                    }
                    else if (postojiZahtev1.status == "prihvacen") {
                        res.json({ poruka: "Vas zahtev je prihvacen! Mozete se ulogovati!" });
                        return;
                    }
                    else if (postojiZahtev1.status == "odbijen") {
                        res.json({ poruka: "Ne mozete koristiti ovo korisnicko ime!" });
                        return;
                    }
                }
                else {
                    zahtevRegistracija_1.default.findOne({ mejl: mejl }).then((postojiZahtev2) => {
                        if (postojiZahtev2) {
                            if (postojiZahtev2.status == "na_cekanju") {
                                res.json({ poruka: "Vas zahtev je na cekanju! Sacekajte da ga administrator odobri!" });
                                return;
                            }
                            else if (postojiZahtev2.status == "prihvacen") {
                                res.json({ poruka: "Vas zahtev je prihvacen! Mozete se ulogovati!" });
                                return;
                            }
                            else if (postojiZahtev2.status == "odbijen") {
                                res.json({ poruka: "Ne mozete koristiti ovaj mejl!" });
                                return;
                            }
                        }
                        else {
                            zahtevRegistracija_1.default.findOne({ korisnicko_ime: korisnicko_ime, mejl: mejl }).then((postojiZahtev3) => {
                                if (postojiZahtev3) {
                                    if (postojiZahtev3.status == "na_cekanju") {
                                        res.json({ poruka: "Vas zahtev je na cekanju! Sacekajte da ga administrator odobri!" });
                                        return;
                                    }
                                    else if (postojiZahtev3.status == "prihvacen") {
                                        res.json({ poruka: "Vas zahtev je prihvacen! Mozete se ulogovati!" });
                                        return;
                                    }
                                    else if (postojiZahtev3.status == "odbijen") {
                                        res.json({ poruka: "Ne mozete koristiti ovo korisnicko ime i mejl!" });
                                        return;
                                    }
                                }
                                else {
                                    new zahtevRegistracija_1.default({ korisnicko_ime: korisnicko_ime, lozinka: hashedPassword, tip: tip, ime: ime, prezime: prezime, pol: pol,
                                        adresa: adresa, kontakt_telefon: kontakt_telefon, mejl: mejl, profilna_slika: profilna_slika,
                                        broj_kreditne_kartice: broj_kreditne_kartice, status: 'na_cekanju' }).save().then(data => {
                                        if (data) {
                                            res.json({ poruka: "Vas zahtev za registraciju je uspesno dodat! Sacekajte na odobrenje administratora!" });
                                        }
                                        else {
                                            res.json({ poruka: "Neuspesna registracija!" });
                                        }
                                    }).catch(err => {
                                        console.log(err);
                                        res.json(err);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
        this.proveriLozinku = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            let lozinka = req.body.lozinka;
            korisnik_1.default.findOne({ korisnicko_ime: korisnicko_ime })
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                if (user == null) {
                    res.json({ poruka: 'Korisnik sa ovim korisnickim imenom ne postoji!' });
                }
                else {
                    if (user.lozinka) {
                        const match = yield bcrypt_1.default.compare(lozinka, user.lozinka);
                        if (!match) {
                            res.json({ poruka: 'Stara lozinka korisnika nije tacna!' });
                        }
                        else {
                            res.json({ poruka: 'Lozinke se poklapaju!' });
                        }
                    }
                }
            }))
                .catch((err) => console.log(err));
        };
        this.promeniLozinkuKorisniku = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let korisnicko_ime = req.body.korisnicko_ime;
            let lozinka = req.body.lozinka;
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(lozinka, saltRounds);
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { lozinka: hashedPassword }).then(data => {
                if (data)
                    res.json({ poruka: 'Uspesna promena lozinke!' });
                else
                    res.json({ poruka: 'Neuspesna promena lozinke!' });
            }).catch((err) => console.log(err));
        });
        this.azurirajSlikuZaKorisnika = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.fileValidationError) {
                res.json({ poruka: req.fileValidationError });
                return;
            }
            let korisnicko_ime = req.body.korisnicko_ime;
            let profilna_slika;
            if (req.file) {
                profilna_slika = req.file.filename;
            }
            else {
                profilna_slika = 'default_user_photo.jpg';
            }
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { profilna_slika: profilna_slika }, { new: true }).then(data => {
                if (data) {
                    return res.json(data);
                }
                else {
                    res.json({ poruka: "Slika nije azurirana!" });
                }
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        });
        this.azurirajImeZaKorisnika = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            let ime = req.body.ime;
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { ime: ime }, { new: true }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.azurirajPrezimeZaKorisnika = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            let prezime = req.body.prezime;
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { prezime: prezime }, { new: true }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.azurirajAdresuZaKorisnika = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            let adresa = req.body.adresa;
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { adresa: adresa }, { new: true }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.azurirajTelefonZaKorisnika = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            let kontakt_telefon = req.body.kontakt_telefon;
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { kontakt_telefon: kontakt_telefon }, { new: true }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.azurirajEMailZaKorisnika = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            let mejl = req.body.mejl;
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { mejl: mejl }, { new: true }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.azurirajCCNZaKorisnika = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            let broj_kreditne_kartice = req.body.broj_kreditne_kartice;
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { broj_kreditne_kartice: broj_kreditne_kartice }, { new: true }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiUkupanBrojVlasnika = (req, res) => {
            korisnik_1.default.countDocuments({ tip: 'vlasnik' }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiUkupanBrojTurista = (req, res) => {
            korisnik_1.default.countDocuments({ tip: 'turista' }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiSveVlasnike = (req, res) => {
            korisnik_1.default.find({ tip: 'vlasnik' }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiSveTuriste = (req, res) => {
            korisnik_1.default.find({ tip: 'turista' }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.izmeniKorisnika = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.fileValidationError) {
                res.json({ poruka: req.fileValidationError });
                return;
            }
            let korisnicko_ime = req.body.korisnicko_ime;
            let tip = req.body.tip;
            let ime = req.body.ime;
            let prezime = req.body.prezime;
            let pol = req.body.pol;
            let adresa = req.body.adresa;
            let kontakt_telefon = req.body.kontakt_telefon;
            let broj_kreditne_kartice = req.body.broj_kreditne_kartice;
            let updateData = { tip, ime, prezime, pol, adresa, kontakt_telefon, broj_kreditne_kartice };
            let profilna_slika;
            if (req.file) {
                updateData.profilna_slika = req.file.filename;
            }
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, updateData, { new: true }).then(data => {
                if (data)
                    res.json({ poruka: 'Uspesna promena korisnika!' });
                else
                    res.json({ poruka: 'Neuspesna promena korisnika!' });
            }).catch((err) => console.log(err));
        });
        this.obrisiKorisnika = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            korisnik_1.default.deleteOne({ korisnicko_ime: korisnicko_ime }).then(data => {
                if (data) {
                    res.json({ poruka: 'Uspesno obrisan korisnik!' });
                }
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.deaktivirajKorisnika = (req, res) => {
            let korisnicko_ime = req.body.korisnicko_ime;
            korisnik_1.default.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { status: 'neaktivan' }, { new: true }).then(data => {
                res.json({ poruka: "Nalog uspesno deaktiviran!" });
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
    }
}
exports.KorisnikController = KorisnikController;
