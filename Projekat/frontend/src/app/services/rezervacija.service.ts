import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Rezervacija } from '../models/rezervacija';
import { Poruka } from '../models/poruka';
import { Korisnik } from '../models/korisnik';
import { Vikendica } from '../models/vikendica';

@Injectable({
  providedIn: 'root'
})
export class RezervacijaService {

  private httpClient = inject(HttpClient)
  
  constructor() { }

  dodajRezervaciju(rezervacija: Rezervacija) {
    const data = {
      datum_pocetka: rezervacija.datum_pocetka,
      datum_kraja: rezervacija.datum_kraja,
      odrasli_broj: rezervacija.odrasli_broj,
      deca_broj: rezervacija.deca_broj,
      broj_kreditne_kartice: rezervacija.broj_kreditne_kartice,
      opis: rezervacija.opis,
      rezervant: rezervacija.rezervant,
      vikendica: rezervacija.vikendica,
      datum_rezervacije: rezervacija.datum_rezervacije,
      cena: rezervacija.cena
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/rezervacije/dodajRezervaciju", data)
  }

  dohvatiBrojRezervacijaUPoslednjih24h() {
    return this.httpClient.get<Number>("http://localhost:4000/rezervacije/dohvatiBrojRezervacijaUPoslednjih24h")
  }

  dohvatiBrojRezervacijaUPoslednjih7Dana() {
    return this.httpClient.get<Number>("http://localhost:4000/rezervacije/dohvatiBrojRezervacijaUPoslednjih7Dana")
  }

  dohvatiBrojRezervacijaUPoslednjih30Dana() {
    return this.httpClient.get<Number>("http://localhost:4000/rezervacije/dohvatiBrojRezervacijaUPoslednjih30Dana")
  }

  dohvatiAktivneRezervacijeZaKorisnika(korisnik: Korisnik) {
    const data = {
      rezervant: korisnik
    }
    return this.httpClient.post<Rezervacija[]>("http://localhost:4000/rezervacije/dohvatiAktivneRezervacijeZaKorisnika", data)
  }

  dohvatiNeobradjeneRezervacijeZaMojeVikendice(vlasnik: Korisnik) {
    const data = {
      vlasnik: vlasnik
    }
    return this.httpClient.post<Rezervacija[]>("http://localhost:4000/rezervacije/dohvatiNeobradjeneRezervacijeZaMojeVikendice", data)
  }

  potvrdiRezervaciju(rezervacija: Rezervacija) {
    const data = {
      id: rezervacija.id,
      datum_pocetka: rezervacija.datum_pocetka,
      datum_kraja: rezervacija.datum_kraja,
      vikendica: rezervacija.vikendica
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/rezervacije/potvrdiRezervaciju", data)
  }

  odbijRezervaciju(id: Number, komentarZaOdbijanje: string) {
    const data = {
      id: id,
      komentarZaOdbijanje: komentarZaOdbijanje
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/rezervacije/odbijRezervaciju", data)
  }

  odbijRezervacijeZaVikendicu(vikendica: Vikendica) {
    const data = {
      vikendica: vikendica
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/rezervacije/odbijRezervacijeZaVikendicu", data)
  }

  dohvatiArhiviraneRezervacijeZaKorisnika(korisnik: Korisnik) {
    const data = {
      rezervant: korisnik
    }
    return this.httpClient.post<Rezervacija[]>("http://localhost:4000/rezervacije/dohvatiArhiviraneRezervacijeZaKorisnika", data)
  }

  otkaziRezervaciju(rezervacija: Rezervacija) {
    const data = {
      id: rezervacija.id
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/rezervacije/otkaziRezervaciju", data)
  }

  dohvatiSveRezervacijeZaMojeVikendice(vlasnik: Korisnik) {
    const data = {
      vlasnik: vlasnik
    }
    return this.httpClient.post<Rezervacija[]>("http://localhost:4000/rezervacije/dohvatiSveRezervacijeZaMojeVikendice", data)
  }
}
