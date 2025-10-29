import mongoose from "mongoose";
import KorisnikModel from "../models/korisnik";
import VikendicaModel from "../models/vikendica";

const Schema = mongoose.Schema;

let Rezervacija = new Schema({
  id: {
    type: Number
  },
  datum_pocetka: {
    type: Date,
  },
  datum_kraja: {
    type: Date,
  },
  odrasli_broj: {
    type: Number,
  },
  deca_broj: {
    type: Number,
  },
  broj_kreditne_kartice: {
    type: String,
  },
  opis: {
    type: String,
  },
  rezervant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: KorisnikModel,  
    required: true
  },
  vikendica: {
    type: mongoose.Schema.Types.ObjectId,
    ref: VikendicaModel,  
    required: true
  },
  datum_rezervacije: {
    type: Date,
  },
  cena: {
    type: Number,
  },
  status: {
    type: String,
  },
  komentarZaOdbijanje: {
    type: String,
  }
});

export default mongoose.model("RezervacijaModel", Rezervacija, "rezervacije");