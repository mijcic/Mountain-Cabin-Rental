import mongoose from "mongoose";
import KorisnikModel from "../models/korisnik";

const Schema = mongoose.Schema;

let Vikendica = new Schema({
  id: {
    type: Number
  },
  naziv: {
    type: String,
  },
  mesto: {
    type: String,
  },
  usluge: {
    type: String,
  },
  cenovnik_letnji: {
    type: String,
  },
  cenovnik_zimski: {
    type: String,
  },
  kontakt_telefon: {
    type: String,
  },
  koordinate: {
    type: String,
  },
  slike: [{
    type: String,
  }],
  vlasnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: KorisnikModel,  
    required: true
  },
  datum_odblokiranja: {
    type: Date,
  },
  status: {
    type: String,
  }
});

export default mongoose.model("VikendicaModel", Vikendica, "vikendice");