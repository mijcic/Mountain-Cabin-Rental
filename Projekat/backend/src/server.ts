import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/korisnik.router";
import vikendicaRouter from "./routers/vikendica.router";
import rezervacijaRouter from "./routers/rezervacija.router";
import zahteviRouter from "./routers/zahtevi.router";
import recenzijaRouter from "./routers/recenzija.router";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/vikendice");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

const router = express.Router();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

router.use("/korisnici", userRouter);
router.use("/vikendice", vikendicaRouter);
router.use("/rezervacije", rezervacijaRouter);
router.use("/zahtevi", zahteviRouter);
router.use("/recenzije", recenzijaRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/vikendice_uploads", express.static(path.join(__dirname, "../vikendice_uploads")));

app.use("/", router);

const errorHandler: ErrorRequestHandler = ((err: any, res: { json: (arg0: { poruka: string; }) => void; }) => {
  if (err.type === "entity.too.large") {
    res.json({ poruka: "Slika je prevelika, mora biti manja od 5MB!" });
    return;
  }

  console.error(err);
  res.json({ poruka: "Doslo je do greske na serveru!" });
  return;
}) as unknown as ErrorRequestHandler;

app.use(errorHandler);

app.listen(4000, ()=>console.log('Express running on port 4000'))
