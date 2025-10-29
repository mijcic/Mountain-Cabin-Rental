import * as express from "express";
import bcrypt from "bcrypt";
import ZahtevRegistracijaModel from "../models/zahtevRegistracija";
import KorisnikModel from "../models/korisnik";

export class ZahteviController { 
    dohvatiSveZahteveNaCekanju = (req: express.Request, res: express.Response) => {
        ZahtevRegistracijaModel.find({ status: "na_cekanju" }).then(data => {
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
    };

    prihvatiZahtev = async (req: express.Request, res: express.Response) => {
        if ((req as any).fileValidationError) {
            res.json({ poruka: (req as any).fileValidationError });
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

        let profilna_slika: string;

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

        KorisnikModel.findOne({ korisnicko_ime: korisnicko_ime}).then((data) => {
            if (data) {
                res.json({poruka: "Korisnik sa ovim korisnickom imenom vec postoji, pa nije moguce odobriti zahtev!"})
                return;
            }
            else {
                KorisnikModel.findOne({mejl: mejl}).then((data1) => {
                    if (data1) {
                        res.json({poruka: "Korisnik sa ovim mejlom vec postoji, pa nije moguce odobriti zahtev!"})
                        return;
                    }
                    else {
                        KorisnikModel.findOne({korisnicko_ime: korisnicko_ime, mejl: mejl}).then(async (data2) => {
                            if (data2) {
                                res.json({poruka: "Korisnik sa ovim korisnickim imenom i mejlom vec postoji, pa nije moguce odobriti zahtev!"})
                                return;
                            }
                            else {
                                await ZahtevRegistracijaModel.updateOne({ korisnicko_ime: korisnicko_ime }, { status: "prihvacen" }).then(data => {
                                    new KorisnikModel({ korisnicko_ime: korisnicko_ime, lozinka: lozinka, tip: tip, ime: ime, prezime: prezime, pol: pol, 
                                    adresa: adresa, kontakt_telefon: kontakt_telefon, mejl: mejl, profilna_slika: profilna_slika, 
                                    broj_kreditne_kartice: broj_kreditne_kartice, status: 'aktivan' }).save().then(data3 => {
                                        if (data3) {
                                            res.json({poruka: "Zahtev za registraciju je odobren!"})
                                        }
                                        else {
                                            res.json({poruka: "Zahtev za registraciju nije odobren!"})
                                        }
                                    }).catch(err=>{
                                        console.log(err)
                                        res.json(err)
                                    })
                                }).catch(err=>{
                                    console.log(err)
                                    res.json(err)
                                })
                            }
                        })
                    }
                })
            }
        })
    };

    odbijZahtev = (req: express.Request, res: express.Response) => {
        let korisnicko_ime = req.body.korisnicko_ime;

        ZahtevRegistracijaModel.updateOne({ korisnicko_ime: korisnicko_ime }, { status: "odbijen" }).then(data => {
            res.json({poruka: "Zahtev uspesno odbijen!"})
        }).catch(err=>{
            console.log(err)
            res.json(err)
        })
     }
}