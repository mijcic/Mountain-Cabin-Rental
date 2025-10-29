import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Korisnik = new Schema({
  korisnicko_ime: {
    type: String,
  },
  lozinka: {
    type: String,
  },
  tip: {
    type: String,
  },
  ime: {
    type: String,
  },
  prezime: {
    type: String,
  },
  pol: {
    type: String,
  },
  adresa: {
    type: String,
  },
  kontakt_telefon: {
    type: String,
  },
  mejl: {
    type: String,
  },
  profilna_slika: {
    type: String,
  },
  broj_kreditne_kartice: {
    type: String,
  },
  status: {
    type: String,
  },
});

export default mongoose.model("KorisnikModel", Korisnik, "korisnici");