import { Korisnik } from "./korisnik"

export class Vikendica {
  id = 0
  naziv = ''
  mesto = ''
  usluge = ''
  cenovnik_letnji = ''
  cenovnik_zimski = ''
  kontakt_telefon = ''
  koordinate = ''
  slike: File[] = []
  vlasnik: Korisnik | null = null
  prosecna_ocena: number | null = 0
  datum_odblokiranja: Date | null = null
  status = ''
}