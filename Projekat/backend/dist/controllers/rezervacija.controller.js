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
exports.RezervacijaController = void 0;
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
const vikendica_1 = __importDefault(require("../models/vikendica"));
class RezervacijaController {
    constructor() {
        this.dodajRezervaciju = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let datum_pocetka = req.body.datum_pocetka;
            let datum_kraja = req.body.datum_kraja;
            let odrasli_broj = req.body.odrasli_broj;
            let deca_broj = req.body.deca_broj;
            let broj_kreditne_kartice = req.body.broj_kreditne_kartice;
            let opis = req.body.opis;
            let rezervant = req.body.rezervant;
            let vikendica = req.body.vikendica;
            let datum_rezervacije = req.body.datum_rezervacije;
            let cena = req.body.cena;
            let last = yield rezervacija_1.default.findOne().sort({ id: -1 }).exec();
            let newId = last ? last.id + 1 : 1;
            let zauzeta = yield rezervacija_1.default.findOne({ vikendica: vikendica, status: 'potvrdjena',
                $or: [{ datum_pocetka: { $lte: datum_kraja }, datum_kraja: { $gte: datum_pocetka } }]
            });
            let datum_pocetka1 = new Date(req.body.datum_pocetka);
            let datum_kraja1 = new Date(req.body.datum_kraja);
            let datum_odblokiranja = new Date(vikendica.datum_odblokiranja);
            let datum_blokiranja = new Date(datum_odblokiranja.getTime() - 48 * 60 * 60 * 1000);
            if (zauzeta) {
                res.json({ poruka: "Vikendica je u tom periodu zauzeta!" });
                return;
            }
            else if (vikendica.status == "blokirana" &&
                ((datum_pocetka1 >= datum_blokiranja && datum_pocetka1 <= datum_odblokiranja) ||
                    (datum_kraja1 >= datum_blokiranja && datum_kraja1 <= datum_odblokiranja) ||
                    (datum_pocetka1 <= datum_blokiranja && datum_kraja1 >= datum_odblokiranja))) {
                res.json({ poruka: "Vikendica je blokirana i ne može se rezervisati u izabranom periodu!" });
                return;
            }
            else {
                new rezervacija_1.default({ id: newId, datum_pocetka: datum_pocetka, datum_kraja: datum_kraja, odrasli_broj: odrasli_broj,
                    deca_broj: deca_broj, broj_kreditne_kartice: broj_kreditne_kartice, opis: opis, rezervant: rezervant, vikendica: vikendica,
                    datum_rezervacije: datum_rezervacije, cena: cena, status: 'neobradjena', komentarZaOdbijanje: ''
                }).save().then(data => {
                    if (data)
                        res.json({ poruka: "Uspesno dodata rezervacija!" });
                    else
                        res.json({ poruka: "Neuspesno dodata rezervacija!" });
                }).catch(err => {
                    console.log(err);
                    res.json(err);
                });
            }
        });
        this.dohvatiBrojRezervacijaUPoslednjih24h = (req, res) => {
            let sada = new Date();
            let pre24h = new Date(sada.getTime() - 24 * 60 * 60 * 1000);
            rezervacija_1.default.countDocuments({ datum_rezervacije: { $gte: pre24h } }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiBrojRezervacijaUPoslednjih7Dana = (req, res) => {
            let sada = new Date();
            let pre7dana = new Date(sada.getTime() - 7 * 24 * 60 * 60 * 1000);
            rezervacija_1.default.countDocuments({ datum_rezervacije: { $gte: pre7dana } }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiBrojRezervacijaUPoslednjih30Dana = (req, res) => {
            let sada = new Date();
            let pre30dana = new Date(sada.getTime() - 30 * 24 * 60 * 60 * 1000);
            rezervacija_1.default.countDocuments({ datum_rezervacije: { $gte: pre30dana } }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiAktivneRezervacijeZaKorisnika = (req, res) => {
            let rezervant = req.body.rezervant;
            rezervacija_1.default.find({ rezervant: rezervant, datum_kraja: { $gte: new Date() } }).populate("vikendica").then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiNeobradjeneRezervacijeZaMojeVikendice = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let vlasnik = req.body.vlasnik;
            let vikendice = yield vikendica_1.default.find({ vlasnik: vlasnik });
            rezervacija_1.default.find({ vikendica: { $in: vikendice }, status: 'neobradjena' }).populate("vikendica")
                .populate("rezervant").sort({ datum_rezervacije: -1 }).then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        });
        this.potvrdiRezervaciju = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let id = req.body.id;
            let datum_pocetka = req.body.datum_pocetka;
            let datum_kraja = req.body.datum_kraja;
            let vikendica = req.body.vikendica;
            let konflikt = yield rezervacija_1.default.findOne({ vikendica: vikendica, status: "potvrdjena",
                $or: [{ datum_pocetka: { $lte: datum_kraja }, datum_kraja: { $gte: datum_pocetka } }]
            });
            if (konflikt) {
                rezervacija_1.default.findOneAndUpdate({ id: id }, { status: 'odbijena', komentarZaOdbijanje: "Vikendica je vec rezervisana u ovom periodu, pa potvrda rezervacije nije moguca!" }, { new: true }).then(data => {
                    if (data) {
                        res.json({ poruka: "Vikendica je vec rezervisana u ovom periodu, pa potvrda rezervacije nije moguca!" });
                    }
                }).catch(err => {
                    console.log(err);
                    res.json(err);
                });
            }
            else {
                rezervacija_1.default.findOneAndUpdate({ id: id }, { status: 'potvrdjena' }, { new: true }).then(data => {
                    if (data) {
                        res.json({ poruka: "Uspesno potvrdjena rezervacija!" });
                    }
                }).catch(err => {
                    console.log(err);
                    res.json(err);
                });
            }
        });
        this.odbijRezervaciju = (req, res) => {
            let id = req.body.id;
            let komentarZaOdbijanje = req.body.komentarZaOdbijanje;
            rezervacija_1.default.findOneAndUpdate({ id: id }, { komentarZaOdbijanje: komentarZaOdbijanje, status: 'odbijena' }, { new: true }).then(data => {
                if (data) {
                    res.json({ poruka: "Uspesno odbijena rezervacija!" });
                }
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.odbijRezervacijeZaVikendicu = (req, res) => {
            let vikendica = req.body.vikendica;
            rezervacija_1.default.updateMany({ vikendica: vikendica, status: { $ne: 'odbijena' } }, { komentarZaOdbijanje: 'Vikendica vise nije dostupna', status: 'odbijena' }).then(data => {
                res.json({ poruka: `Uspesno odbijeno ${data.modifiedCount} rezervacija!` });
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.dohvatiArhiviraneRezervacijeZaKorisnika = (req, res) => {
            let rezervant = req.body.rezervant;
            rezervacija_1.default.find({ rezervant: rezervant, datum_kraja: { $lt: new Date() }, status: "potvrdjena" }).populate("vikendica")
                .sort({ datum_kraja: -1 }).then(data => {
                res.json(data);
            })
                .catch(err => {
                console.log(err);
                res.json(err);
            });
        };
        this.otkaziRezervaciju = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let id = req.body.id;
            yield rezervacija_1.default.findOne({ id: id }).then(data => {
                if (data) {
                    let rezervacija = data;
                    if (rezervacija.status == "odbijena") {
                        return res.json({ poruka: "Rezervacija je odbijena od strane vlasnika." });
                    }
                    if (!rezervacija.datum_pocetka) {
                        return res.json({ poruka: "Rezervacija nema definisan datum početka." });
                    }
                    let sada = new Date();
                    let datumPocetka = rezervacija.datum_pocetka instanceof Date ? rezervacija.datum_pocetka : new Date(rezervacija.datum_pocetka);
                    let razlikaMS = datumPocetka.getTime() - sada.getTime(); // milisekunde
                    let razlikaH = razlikaMS / (1000 * 60 * 60); // pretvori u sate
                    if (razlikaH < 24) {
                        res.json({ poruka: "Rezervaciju više nije moguće otkazati, jer je manje od 24h do početka." });
                        return;
                    }
                    else {
                        rezervacija_1.default.updateOne({ id: id }, { status: 'otkazana' }).then(data => {
                            if (data) {
                                res.json({ poruka: "Rezervacija je uspesno otkazana!" });
                                return;
                            }
                        })
                            .catch(err => {
                            console.log(err);
                            res.json(err);
                        });
                    }
                }
                else {
                    res.json({ poruka: "Rezervacija nije pronađena." });
                    return;
                }
            });
        });
        this.dohvatiSveRezervacijeZaMojeVikendice = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let vlasnik = req.body.vlasnik;
            let vikendice = yield vikendica_1.default.find({ vlasnik: vlasnik });
            rezervacija_1.default.find({ vikendica: { $in: vikendice } }).populate("vikendica")
                .populate("rezervant").then(data => {
                res.json(data);
            }).catch(err => {
                console.log(err);
                res.json(err);
            });
        });
    }
}
exports.RezervacijaController = RezervacijaController;
