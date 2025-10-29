"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const korisnik_router_1 = __importDefault(require("./routers/korisnik.router"));
const vikendica_router_1 = __importDefault(require("./routers/vikendica.router"));
const rezervacija_router_1 = __importDefault(require("./routers/rezervacija.router"));
const zahtevi_router_1 = __importDefault(require("./routers/zahtevi.router"));
const recenzija_router_1 = __importDefault(require("./routers/recenzija.router"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect("mongodb://127.0.0.1:27017/vikendice");
const connection = mongoose_1.default.connection;
connection.once("open", () => {
    console.log("db connection ok");
});
const router = express_1.default.Router();
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
router.use("/korisnici", korisnik_router_1.default);
router.use("/vikendice", vikendica_router_1.default);
router.use("/rezervacije", rezervacija_router_1.default);
router.use("/zahtevi", zahtevi_router_1.default);
router.use("/recenzije", recenzija_router_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/vikendice_uploads", express_1.default.static(path_1.default.join(__dirname, "../vikendice_uploads")));
app.use("/", router);
const errorHandler = ((err, res) => {
    if (err.type === "entity.too.large") {
        res.json({ poruka: "Slika je prevelika, mora biti manja od 5MB!" });
        return;
    }
    console.error(err);
    res.json({ poruka: "Doslo je do greske na serveru!" });
    return;
});
app.use(errorHandler);
app.listen(4000, () => console.log('Express running on port 4000'));
