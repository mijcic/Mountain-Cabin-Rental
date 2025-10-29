import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Recenzija } from '../models/recenzija';
import { Poruka } from '../models/poruka';
import { Korisnik } from '../models/korisnik';
import { Observable } from 'rxjs/internal/Observable';
import { Vikendica } from '../models/vikendica';

@Injectable({
  providedIn: 'root'
})
export class RecenzijeService {

  private httpClient = inject(HttpClient)
    
  constructor() { }

  ostaviRecenziju(recenzija: Recenzija) {
    const data = {
      komentar: recenzija.komentar,
      ocena: recenzija.ocena,
      korisnik: recenzija.korisnik,
      rezervacija: recenzija.rezervacija
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/recenzije/ostaviRecenziju", data)
  }

  dohvatiSveRecenzijeZaKorisnika(korisnik: Korisnik) {
    const data = {
      korisnik: korisnik
    }
    return this.httpClient.post<Recenzija[]>("http://localhost:4000/recenzije/dohvatiSveRecenzijeZaKorisnika", data)
  }

  dohvatiProsecnuOcenuZaVikendicu(vikendica: Vikendica) {
    const data = {
      vikendica: vikendica
    }
    return this.httpClient.post<Number>("http://localhost:4000/recenzije/dohvatiProsecnuOcenuZaVikendicu", data)
  }

  dohvatiRecenzijeZaVikendicu(vikendica: Vikendica) {
    const data = {
      vikendica: vikendica
    }
    return this.httpClient.post<Recenzija[]>("http://localhost:4000/recenzije/dohvatiRecenzijeZaVikendicu", data)
  }
}
