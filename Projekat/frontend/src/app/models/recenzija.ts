import { Korisnik } from "./korisnik"
import { Rezervacija } from "./rezervacija"

export class Recenzija {
  komentar = ''
  ocena = 0
  korisnik: Korisnik | null = null
  rezervacija: Rezervacija | null = null
  datum_ocenjivanja: Date | null = null
}
