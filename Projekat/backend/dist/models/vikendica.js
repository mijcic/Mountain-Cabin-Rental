"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const korisnik_1 = __importDefault(require("../models/korisnik"));
const Schema = mongoose_1.default.Schema;
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: korisnik_1.default,
        required: true
    },
    datum_odblokiranja: {
        type: Date,
    },
    status: {
        type: String,
    }
});
exports.default = mongoose_1.default.model("VikendicaModel", Vikendica, "vikendice");
