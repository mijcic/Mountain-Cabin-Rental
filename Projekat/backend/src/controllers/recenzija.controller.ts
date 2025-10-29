import * as express from "express";
import RecenzijaModel from "../models/recenzija";
import RezervacijaModel from "../models/rezervacija";

export class RecenzijaController { 
    ostaviRecenziju = (req: express.Request, res: express.Response) => {
        let komentar = req.body.komentar;
        let ocena = req.body.ocena;
        let korisnik = req.body.korisnik;
        let rezervacija = req.body.rezervacija;

        new RecenzijaModel({ komentar: komentar, ocena: ocena, korisnik: korisnik, rezervacija: rezervacija, datum_ocenjivanja: new Date() }).save().then(data => {
            if (data) res.json({poruka: "Hvala Vam na oceni i izdvojenom vremenu!"})
            else res.json({poruka: "Neuspesno dodata recenzija!"})
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiSveRecenzijeZaKorisnika = (req: express.Request, res: express.Response) => {
        let korisnik = req.body.korisnik;

        RecenzijaModel.find({ korisnik: korisnik }).populate('rezervacija').then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    dohvatiProsecnuOcenuZaVikendicu = async (req: express.Request, res: express.Response) => {
        try {
            let vikendica = req.body.vikendica;

            let rezervacijeZaVikendicu = await RezervacijaModel.find({ vikendica: vikendica })

            let recenzije = await RecenzijaModel.find({ rezervacija: { $in: rezervacijeZaVikendicu } })

            let zbir = recenzije.reduce((sum, r) => sum + (r.ocena || 0), 0);
            let prosecna = zbir / recenzije.length;
            
            res.json(prosecna)
        }
        catch (err) {
            console.log(err)
            res.json(err)
        }
    };

    dohvatiRecenzijeZaVikendicu = async (req: express.Request, res: express.Response) => {
        let vikendica = req.body.vikendica;

        let rezervacijeZaVikendicu = await RezervacijaModel.find({ vikendica: vikendica })

        RecenzijaModel.find({ rezervacija: { $in: rezervacijeZaVikendicu } }).populate('korisnik').then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };
}