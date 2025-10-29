"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const korisnik_1 = __importDefault(require("../models/korisnik"));
const vikendica_1 = __importDefault(require("../models/vikendica"));
const Schema = mongoose_1.default.Schema;
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: korisnik_1.default,
        required: true
    },
    vikendica: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: vikendica_1.default,
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
exports.default = mongoose_1.default.model("RezervacijaModel", Rezervacija, "rezervacije");
