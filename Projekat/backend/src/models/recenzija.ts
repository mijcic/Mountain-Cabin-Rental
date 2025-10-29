import mongoose from "mongoose";
import KorisnikModel from "../models/korisnik";
import RezervacijaModel from "../models/rezervacija";

const Schema = mongoose.Schema;

let Recenzija = new Schema({
  komentar: {
    type: String
  },
  ocena: {
    type: Number,
  },
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: KorisnikModel,  
    required: true
  },
  rezervacija: {
    type: mongoose.Schema.Types.ObjectId,
    ref: RezervacijaModel,  
    required: true
  },
  datum_ocenjivanja: {
    type: Date,
  }
});

export default mongoose.model("RecenzijaModel", Recenzija, "recenzije");