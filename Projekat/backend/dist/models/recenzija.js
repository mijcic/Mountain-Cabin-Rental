"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const korisnik_1 = __importDefault(require("../models/korisnik"));
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
const Schema = mongoose_1.default.Schema;
let Recenzija = new Schema({
    komentar: {
        type: String
    },
    ocena: {
        type: Number,
    },
    korisnik: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: korisnik_1.default,
        required: true
    },
    rezervacija: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: rezervacija_1.default,
        required: true
    },
    datum_ocenjivanja: {
        type: Date,
    }
});
exports.default = mongoose_1.default.model("RecenzijaModel", Recenzija, "recenzije");
