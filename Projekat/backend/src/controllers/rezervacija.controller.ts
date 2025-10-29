import * as express from "express";
import RezervacijaModel from "../models/rezervacija";
import VikendicaModel from "../models/vikendica";

export class RezervacijaController {
    dodajRezervaciju = async (req: express.Request, res: express.Response) => {
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

        let last = await RezervacijaModel.findOne().sort({ id: -1 }).exec();
        let newId = last ? last.id + 1 : 1;

        let zauzeta = await RezervacijaModel.findOne({ vikendica: vikendica, status: 'potvrdjena',
            $or: [{ datum_pocetka: { $lte: datum_kraja }, datum_kraja: { $gte: datum_pocetka } }]
        })

        let datum_pocetka1 = new Date(req.body.datum_pocetka);
        let datum_kraja1 = new Date(req.body.datum_kraja);
        let datum_odblokiranja = new Date(vikendica.datum_odblokiranja)
        let datum_blokiranja = new Date(datum_odblokiranja.getTime() - 48 * 60 * 60 * 1000);

        if (zauzeta) {
            res.json({poruka: "Vikendica je u tom periodu zauzeta!"})
            return
        }
        else if (vikendica.status == "blokirana" && 
            ((datum_pocetka1 >= datum_blokiranja && datum_pocetka1 <= datum_odblokiranja) ||
            (datum_kraja1 >= datum_blokiranja && datum_kraja1 <= datum_odblokiranja) || 
            (datum_pocetka1 <= datum_blokiranja && datum_kraja1 >= datum_odblokiranja))
        ) {
            res.json({ poruka: "Vikendica je blokirana i ne može se rezervisati u izabranom periodu!" });
            return;
        }
        else {
            new RezervacijaModel({ id: newId, datum_pocetka: datum_pocetka, datum_kraja: datum_kraja, odrasli_broj: odrasli_broj, 
                deca_broj: deca_broj, broj_kreditne_kartice: broj_kreditne_kartice, opis: opis, rezervant: rezervant, vikendica: vikendica,
                datum_rezervacije: datum_rezervacije, cena: cena, status: 'neobradjena', komentarZaOdbijanje: ''
            }).save().then(data => {
                if (data) res.json({poruka: "Uspesno dodata rezervacija!"})
                else res.json({poruka: "Neuspesno dodata rezervacija!"})
            }).catch(err=>{
                console.log(err)
                res.json(err)
            })
        }
    };

    dohvatiBrojRezervacijaUPoslednjih24h = (req: express.Request, res: express.Response) => {
        let sada = new Date();

        let pre24h = new Date(sada.getTime() - 24 * 60 * 60 * 1000);
        RezervacijaModel.countDocuments({ datum_rezervacije: { $gte: pre24h } }).then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiBrojRezervacijaUPoslednjih7Dana = (req: express.Request, res: express.Response) => {
        let sada = new Date();

        let pre7dana  = new Date(sada.getTime() - 7 * 24 * 60 * 60 * 1000);
        RezervacijaModel.countDocuments({ datum_rezervacije: { $gte: pre7dana  } }).then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiBrojRezervacijaUPoslednjih30Dana = (req: express.Request, res: express.Response) => {
        let sada = new Date();

        let pre30dana  = new Date(sada.getTime() - 30 * 24 * 60 * 60 * 1000);
        RezervacijaModel.countDocuments({ datum_rezervacije: { $gte: pre30dana } }).then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiAktivneRezervacijeZaKorisnika = (req: express.Request, res: express.Response) => {
        let rezervant = req.body.rezervant;

        RezervacijaModel.find({ rezervant: rezervant, datum_kraja: { $gte: new Date() } }).populate("vikendica").then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiNeobradjeneRezervacijeZaMojeVikendice = async (req: express.Request, res: express.Response) => {
        let vlasnik = req.body.vlasnik;

        let vikendice = await VikendicaModel.find({ vlasnik: vlasnik })

        RezervacijaModel.find({ vikendica: { $in: vikendice }, status: 'neobradjena' }).populate("vikendica")
        .populate("rezervant").sort({ datum_rezervacije: -1 }).then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    potvrdiRezervaciju = async (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let datum_pocetka = req.body.datum_pocetka;
        let datum_kraja = req.body.datum_kraja;
        let vikendica = req.body.vikendica;

        let konflikt = await RezervacijaModel.findOne({vikendica: vikendica, status: "potvrdjena",
            $or: [{ datum_pocetka: { $lte: datum_kraja }, datum_kraja: { $gte: datum_pocetka }}]
        });

        if (konflikt) {
            RezervacijaModel.findOneAndUpdate({ id: id }, { status: 'odbijena', komentarZaOdbijanje: "Vikendica je vec rezervisana u ovom periodu, pa potvrda rezervacije nije moguca!" }, {new: true}).then(data => {
            if (data) {
                res.json({poruka: "Vikendica je vec rezervisana u ovom periodu, pa potvrda rezervacije nije moguca!"})
            }
            }).catch(err=>{
                console.log(err)
                res.json(err)
            })
        }
        else {
            RezervacijaModel.findOneAndUpdate({ id: id }, { status: 'potvrdjena' }, {new: true}).then(data => {
            if (data) {
                res.json({poruka: "Uspesno potvrdjena rezervacija!"})
            }
            }).catch(err=>{
                console.log(err)
                res.json(err)
            })
        }
    };

    odbijRezervaciju = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let komentarZaOdbijanje = req.body.komentarZaOdbijanje;

        RezervacijaModel.findOneAndUpdate({ id: id }, { komentarZaOdbijanje: komentarZaOdbijanje, status: 'odbijena' }, {new: true}).then(data => {
          if (data) {
            res.json({poruka: "Uspesno odbijena rezervacija!"})
          }
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    odbijRezervacijeZaVikendicu = (req: express.Request, res: express.Response) => {
        let vikendica = req.body.vikendica;

        RezervacijaModel.updateMany({ vikendica: vikendica, status: { $ne: 'odbijena' } }, 
            { komentarZaOdbijanje: 'Vikendica vise nije dostupna', status: 'odbijena' }).then(data => {
          res.json({poruka: `Uspesno odbijeno ${data.modifiedCount} rezervacija!`})
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiArhiviraneRezervacijeZaKorisnika = (req: express.Request, res: express.Response) => {
        let rezervant = req.body.rezervant;

        RezervacijaModel.find({ rezervant: rezervant, datum_kraja: { $lt: new Date() }, status: "potvrdjena" }).populate("vikendica")
        .sort({ datum_kraja: -1 }).then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
    };

    otkaziRezervaciju = async (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        await RezervacijaModel.findOne({ id: id }).then(data => {
            if (data) {
                let rezervacija = data

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

                if (razlikaH  < 24) {
                    res.json({ poruka: "Rezervaciju više nije moguće otkazati, jer je manje od 24h do početka." });
                    return
                }
                else {
                    RezervacijaModel.updateOne({id: id}, {status: 'otkazana'}).then(data => {
                        if (data) {
                            res.json({ poruka: "Rezervacija je uspesno otkazana!" });
                            return
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
                return
            }
        })
    };

    dohvatiSveRezervacijeZaMojeVikendice = async (req: express.Request, res: express.Response) => {
        let vlasnik = req.body.vlasnik;

        let vikendice = await VikendicaModel.find({ vlasnik: vlasnik })

        RezervacijaModel.find({ vikendica: { $in: vikendice } }).populate("vikendica")
        .populate("rezervant").then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };
}