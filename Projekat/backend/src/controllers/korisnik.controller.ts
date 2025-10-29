import * as express from "express";
import KorisnikModel from "../models/korisnik";
import ZahtevRegistracijaModel from "../models/zahtevRegistracija";
import bcrypt from "bcrypt";

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

export class KorisnikController {
  proveriKorisnickoIme = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;

    KorisnikModel.findOne({ korisnicko_ime: korisnicko_ime })
      .then((user) => {
        if (user != null) {
            res.json({poruka: "Vec postoji!"});
        }
        else {
            res.json({poruka: "Korisnik sa ovim korisnickim imenom ne postoji!"});
        }
      })
      .catch((err) => console.log(err));
  };

  proveriEmailAdresu = (req: express.Request, res: express.Response) => {
    let mejl = req.body.mejl;

    KorisnikModel.findOne({ mejl: mejl })
      .then((user) => {
        if (user != null) {
            res.json({poruka: "Vec postoji!"});
        }
        else {
            res.json({poruka: "Korisnik sa ovim korisnickim imenom ne postoji!"});
        }
      })
      .catch((err) => console.log(err));
  };

  login = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let lozinka = req.body.lozinka;

    KorisnikModel.findOne({ korisnicko_ime: korisnicko_ime })
      .then(async (user) => {
        if (user == null) {
          res.json({poruka: "Korisnik sa ovim korisnickim imenom ne postoji!"})
        }
        else {
          if (user.lozinka) {
            const match = await bcrypt.compare(lozinka, user.lozinka);
            if (!match) {
              res.json({poruka: "Lozinka nije tacna!"})
            }
            else {
              if (user.status == 'neaktivan') {
                res.json({poruka: "Nalog je deaktiviran!"})
              }
              else {
                res.json(user);
              }
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };

  register = async (req: express.Request, res: express.Response) => {
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

    if (req.file) {
      profilna_slika = req.file.filename;
    } 
    else {
      profilna_slika = 'default_user_photo.jpg';
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(lozinka, saltRounds);

    ZahtevRegistracijaModel.findOne({ korisnicko_ime: korisnicko_ime}).then((postojiZahtev1) => {
      if (postojiZahtev1) {
        if (postojiZahtev1.status == "na_cekanju") {
          res.json({poruka: "Vas zahtev je na cekanju! Sacekajte da ga administrator odobri!"})
          return;
        }
        else if (postojiZahtev1.status == "prihvacen") {
          res.json({poruka: "Vas zahtev je prihvacen! Mozete se ulogovati!"})
          return;
        }
        else if (postojiZahtev1.status == "odbijen") {
          res.json({poruka: "Ne mozete koristiti ovo korisnicko ime!"})
          return;
        }
      }
      else {
        ZahtevRegistracijaModel.findOne({mejl: mejl}).then((postojiZahtev2) => {
          if (postojiZahtev2) {
            if (postojiZahtev2.status == "na_cekanju") {
              res.json({poruka: "Vas zahtev je na cekanju! Sacekajte da ga administrator odobri!"})
              return;
            }
            else if (postojiZahtev2.status == "prihvacen") {
              res.json({poruka: "Vas zahtev je prihvacen! Mozete se ulogovati!"})
              return;
            }
            else if (postojiZahtev2.status == "odbijen") {
              res.json({poruka: "Ne mozete koristiti ovaj mejl!"})
              return;
            }
          }
          else {
            ZahtevRegistracijaModel.findOne({korisnicko_ime: korisnicko_ime, mejl: mejl}).then((postojiZahtev3) => {
              if (postojiZahtev3) {
                if (postojiZahtev3.status == "na_cekanju") {
                  res.json({poruka: "Vas zahtev je na cekanju! Sacekajte da ga administrator odobri!"})
                  return;
                }
                else if (postojiZahtev3.status == "prihvacen") {
                  res.json({poruka: "Vas zahtev je prihvacen! Mozete se ulogovati!"})
                  return;
                }
                else if (postojiZahtev3.status == "odbijen") {
                  res.json({poruka: "Ne mozete koristiti ovo korisnicko ime i mejl!"})
                  return;
                }
              }
              else {
                new ZahtevRegistracijaModel({ korisnicko_ime: korisnicko_ime, lozinka: hashedPassword, tip: tip, ime: ime, prezime: prezime, pol: pol, 
                adresa: adresa, kontakt_telefon: kontakt_telefon, mejl: mejl, profilna_slika: profilna_slika, 
                broj_kreditne_kartice: broj_kreditne_kartice, status: 'na_cekanju' }).save().then(data => {
                  if (data) {
                    res.json({poruka: "Vas zahtev za registraciju je uspesno dodat! Sacekajte na odobrenje administratora!"})
                  }
                  else {
                    res.json({poruka: "Neuspesna registracija!"})
                  }
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

  proveriLozinku = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let lozinka = req.body.lozinka;

    KorisnikModel.findOne({ korisnicko_ime: korisnicko_ime})
      .then(async (user) => {
        if (user == null) {
          res.json({ poruka: 'Korisnik sa ovim korisnickim imenom ne postoji!' });
        }
        else {
          if (user.lozinka) {
            const match = await bcrypt.compare(lozinka, user.lozinka);
            if (!match) {
              res.json({ poruka: 'Stara lozinka korisnika nije tacna!' });
            }
            else {
              res.json({ poruka: 'Lozinke se poklapaju!' });
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };

  promeniLozinkuKorisniku = async (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let lozinka = req.body.lozinka;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(lozinka, saltRounds);

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { lozinka: hashedPassword }).then(data => {
      if (data) res.json({ poruka: 'Uspesna promena lozinke!' });
      else res.json({ poruka: 'Neuspesna promena lozinke!' });
    }).catch((err) => console.log(err));
  };

  azurirajSlikuZaKorisnika = async (req: express.Request, res: express.Response) => {
    if ((req as any).fileValidationError) {
      res.json({ poruka: (req as any).fileValidationError });
      return;
    }

    let korisnicko_ime = req.body.korisnicko_ime;

    let profilna_slika: string;

    if (req.file) {
      profilna_slika = req.file.filename;
    } 
    else {
      profilna_slika = 'default_user_photo.jpg';
    }

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { profilna_slika: profilna_slika }, {new: true}).then(data => {
      if (data) {
        return res.json(data)
      }
      else {
        res.json({poruka: "Slika nije azurirana!"})
      }
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
  };

  azurirajImeZaKorisnika = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let ime = req.body.ime;

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { ime: ime }, {new: true}).then(data => {
      res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
  };

  azurirajPrezimeZaKorisnika = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let prezime = req.body.prezime;

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { prezime: prezime }, {new: true}).then(data => {
      res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
  };

  azurirajAdresuZaKorisnika = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let adresa = req.body.adresa;

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { adresa: adresa }, {new: true}).then(data => {
      res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
  };

  azurirajTelefonZaKorisnika = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let kontakt_telefon = req.body.kontakt_telefon;

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { kontakt_telefon: kontakt_telefon }, {new: true}).then(data => {
      res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
  };

  azurirajEMailZaKorisnika = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let mejl = req.body.mejl;

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { mejl: mejl }, {new: true}).then(data => {
      res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
  };

  azurirajCCNZaKorisnika = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;
    let broj_kreditne_kartice = req.body.broj_kreditne_kartice;

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { broj_kreditne_kartice: broj_kreditne_kartice }, {new: true}).then(data => {
      res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
  };

  dohvatiUkupanBrojVlasnika = (req: express.Request, res: express.Response) => {
      KorisnikModel.countDocuments({ tip: 'vlasnik' }).then(data => {
          res.json(data)
      }).catch(err=>{
          console.log(err)
          res.json(err)
      })
  };

  dohvatiUkupanBrojTurista = (req: express.Request, res: express.Response) => {
      KorisnikModel.countDocuments({ tip: 'turista' }).then(data => {
          res.json(data)
      }).catch(err=>{
          console.log(err)
          res.json(err)
      })
  };

  dohvatiSveVlasnike = (req: express.Request, res: express.Response) => {
      KorisnikModel.find({ tip: 'vlasnik' }).then(data => {
          res.json(data)
      }).catch(err=>{
          console.log(err)
          res.json(err)
      })
  };

  dohvatiSveTuriste = (req: express.Request, res: express.Response) => {
      KorisnikModel.find({ tip: 'turista' }).then(data => {
          res.json(data)
      }).catch(err=>{
          console.log(err)
          res.json(err)
      })
  };

  izmeniKorisnika = async (req: express.Request, res: express.Response) => {
    if ((req as any).fileValidationError) {
      res.json({ poruka: (req as any).fileValidationError });
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

    let updateData: any = { tip, ime, prezime, pol, adresa, kontakt_telefon, broj_kreditne_kartice }

    let profilna_slika: string;

    if (req.file) {
      updateData.profilna_slika = req.file.filename;
    }

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, updateData, { new: true }).then(data => {
        if (data) res.json({ poruka: 'Uspesna promena korisnika!' });
        else res.json({ poruka: 'Neuspesna promena korisnika!' });
    }).catch((err) => console.log(err));
  };

  obrisiKorisnika = (req: express.Request, res: express.Response) => {
      let korisnicko_ime = req.body.korisnicko_ime;

      KorisnikModel.deleteOne({ korisnicko_ime: korisnicko_ime }).then(data => {
          if (data) {
            res.json({ poruka: 'Uspesno obrisan korisnik!' });
          }
      }).catch(err=>{
          console.log(err)
          res.json(err)
      })
  };

  deaktivirajKorisnika = (req: express.Request, res: express.Response) => {
    let korisnicko_ime = req.body.korisnicko_ime;

    KorisnikModel.findOneAndUpdate({ korisnicko_ime: korisnicko_ime }, { status: 'neaktivan' }, {new: true}).then(data => {
      res.json({poruka: "Nalog uspesno deaktiviran!"})
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
  };
}