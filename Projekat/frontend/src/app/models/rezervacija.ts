import { Korisnik } from "./korisnik"
import { Vikendica } from "./vikendica"

export class Rezervacija {
  id = 0
  datum_pocetka: Date | null = null
  datum_kraja: Date | null = null
  odrasli_broj = 0
  deca_broj = 0
  broj_kreditne_kartice = ''
  opis = ''
  rezervant: Korisnik | null = null
  vikendica: Vikendica | null = null
  datum_rezervacije: Date | null = null
  cena = 0
  status = ''
  komentarZaOdbijanje = ''
}
