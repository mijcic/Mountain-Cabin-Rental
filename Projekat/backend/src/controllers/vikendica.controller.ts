import * as express from "express";
import VikendicaModel from "../models/vikendica";
import RezervacijaModel from "../models/rezervacija";
import rezervacija from "../models/rezervacija";
import RecenzijaModel from "../models/recenzija";

export class VikendicaController {
    dodajVikendicu = (req: express.Request, res: express.Response) => {
        let naziv = req.body.naziv;
        let mesto = req.body.mesto;
        let usluge = req.body.usluge;
        let cenovnik_letnji = req.body.cenovnik_letnji;
        let cenovnik_zimski = req.body.cenovnik_zimski;
        let kontakt_telefon = req.body.kontakt_telefon;
        let koordinate = req.body.koordinate;
        let vlasnik = JSON.parse(req.body.vlasnik);

        const fajlovi = req.files as Express.Multer.File[];
        const slikePutanje = fajlovi.map(f => f.filename);

        VikendicaModel.findOne({ naziv: naziv, mesto: mesto }).then(async data => {
            if (data) {
                res.json({poruka: "Vikendica sa ovim imenom u ovom mestu vec postoji!"})
            }
            else {
                let last = await VikendicaModel.findOne().sort({ id: -1 }).exec();
                let newId = last ? last.id + 1 : 1;

                new VikendicaModel({ id: newId, naziv: naziv, mesto: mesto, usluge: usluge, cenovnik_letnji: cenovnik_letnji, cenovnik_zimski: cenovnik_zimski, 
                kontakt_telefon: kontakt_telefon, koordinate: koordinate, slike: slikePutanje, vlasnik: vlasnik, status: 'aktivna' }).save().then(data => {
                    if (data) res.json({poruka: "Uspesno dodata vikendica!"})
                    else res.json({poruka: "Neuspesno dodata vikendica!"})
                }).catch(err=>{
                    console.log(err)
                    res.json(err)
                })
            }
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    sveVikendice = (req: express.Request, res: express.Response) => {
        VikendicaModel.find().populate('vlasnik').then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiVikendicuPoNazivu = (req: express.Request, res: express.Response) => {
        let naziv = req.body.naziv;

        VikendicaModel.findOne({ naziv: naziv }).then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiUkupanBrojVikendica = (req: express.Request, res: express.Response) => {
        VikendicaModel.countDocuments({}).then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };
 
    dohvatiSveMojeVikendice = (req: express.Request, res: express.Response) => {
        let vlasnik = req.body.vlasnik;

        VikendicaModel.find({ vlasnik: vlasnik }).then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    obrisiVikendicu = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        VikendicaModel.deleteOne({ id: id }).then(data => {
            if (data) {
                res.json({poruka: "Uspesno obrisana vikendica!"})
            }
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    izmeniVikendicu = async (req: express.Request, res: express.Response) => {
        let id = JSON.parse(req.body.id);
        let naziv = req.body.naziv;
        let mesto = req.body.mesto;
        let usluge = req.body.usluge;
        let cenovnik_letnji = req.body.cenovnik_letnji;
        let cenovnik_zimski = req.body.cenovnik_zimski;
        let kontakt_telefon = req.body.kontakt_telefon;
        let koordinate = req.body.koordinate;
        let vlasnik = JSON.parse(req.body.vlasnik);

        const fajlovi = req.files as Express.Multer.File[] | undefined;
        const noveSlikePutanje = fajlovi?.map(f => f.filename) ?? [];
        const slikePutanje = noveSlikePutanje.length > 0 ? noveSlikePutanje : req.body.slike;

        let vecPostoji = await VikendicaModel.findOne({ naziv: naziv, mesto: mesto })

        if (vecPostoji && id != vecPostoji.id) {
            res.json({poruka: "Vikendica sa ovim nazivom u ovom mestu vec postoji!"})
        }
        else {
            VikendicaModel.updateOne({ id: id }, {naziv: naziv, mesto: mesto, usluge: usluge, cenovnik_letnji: cenovnik_letnji, cenovnik_zimski: cenovnik_zimski, 
            kontakt_telefon: kontakt_telefon, koordinate: koordinate, slike: slikePutanje, vlasnik: vlasnik}).then(data => {
                if (data) res.json({poruka: "Uspesno izmenjena vikendica!"})
            }).catch(err=>{
                console.log(err)
                res.json(err)
            })
        }
    };

    dohvatiVikendiceSaLosimOcenama = async (req: express.Request, res: express.Response) => {
        try {
            let vikendice = await VikendicaModel.find();
            let vikendiceRezultat: any[] = [];

            for (let vikendica of vikendice) {  
                let rezervacije = await RezervacijaModel.find({ vikendica: vikendica });   
                
                let niz = []

                for (let rezervacija of rezervacije) {
                    
                    let recenzija = await RecenzijaModel.findOne({ rezervacija: rezervacija }).populate('rezervacija')

                    niz.push(recenzija)
                }

                niz = niz
                .filter(r => r && r.rezervacija && (r.rezervacija as any).datum_rezervacije)
                .sort(
                    (a, b) =>
                    new Date((b?.rezervacija as any).datum_rezervacije).getTime() -
                    new Date((a?.rezervacija as any).datum_rezervacije).getTime()
                )
                .slice(0, 3);

                let poslednje3Ocene = niz.map(r => r?.ocena ?? 0);

                if (poslednje3Ocene.length === 3 && poslednje3Ocene.every(o => o < 2)) {
                    vikendiceRezultat.push(vikendica);
                }
            }

            res.json(vikendiceRezultat);

        } catch (err) {
            console.log(err)
            res.json(err)
        }
    };

    blokirajVikendicu = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        let danasnjiDatum = new Date();
        let datum_odblokiranja = new Date(danasnjiDatum.getTime() + 48 * 60 * 60 * 1000);

        VikendicaModel.updateOne({ id: id }, { $set: { datum_odblokiranja: datum_odblokiranja, status: 'blokirana' }}).then(data => {
            if (data.modifiedCount > 0) {
                res.json({poruka: "Uspesno blokirana vikendica!"})
            }
            else {
                res.json({poruka: "Greska prilikom blokiranja vikendice!"})
            }
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    odblokirajPotrebneVikendice = (req: express.Request, res: express.Response) => {
        let danasnjiDatum = new Date();

        VikendicaModel.updateMany(
            { datum_odblokiranja: { $lte: danasnjiDatum }, status: 'blokirana' }, 
            { $set: { status: "aktivna", datum_odblokiranja: null }}).then(data => {
            if (data.modifiedCount > 0) {
                res.json({poruka: "Uspesno odblokirane vikendice kojima je istekao period blokiranja!"})
            }
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };
}