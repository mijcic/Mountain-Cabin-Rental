import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vikendica } from '../models/vikendica';
import { Poruka } from '../models/poruka';
import { Korisnik } from '../models/korisnik';

@Injectable({
  providedIn: 'root'
})
export class VikendicaService {

  private httpClient = inject(HttpClient)

  constructor() { }

  dodajVikendicu(vikendica: Vikendica) {
    const formData = new FormData(); 
    formData.append("naziv", vikendica.naziv); 
    formData.append("mesto", vikendica.mesto); 
    formData.append("usluge", vikendica.usluge);
    formData.append("cenovnik_letnji", vikendica.cenovnik_letnji); 
    formData.append("cenovnik_zimski", vikendica.cenovnik_zimski); 
    formData.append("kontakt_telefon", vikendica.kontakt_telefon); 
    formData.append("koordinate", vikendica.koordinate); 
    formData.append("vlasnik", JSON.stringify(vikendica.vlasnik));
    
    vikendica.slike.forEach((slika) => {
      formData.append('slike', slika); 
    });

    return this.httpClient.post<Poruka>("http://localhost:4000/vikendice/dodajVikendicu", formData)
  }

  sveVikendice() {
    return this.httpClient.get<Vikendica[]>("http://localhost:4000/vikendice/sveVikendice")
  }

  dohvatiVikendicuPoNazivu(naziv: string) {
    const data = {
      naziv: naziv
    }
    return this.httpClient.post<Vikendica>("http://localhost:4000/vikendice/dohvatiVikendicuPoNazivu", data)
  }

  dohvatiUkupanBrojVikendica() {
    return this.httpClient.get<Number>("http://localhost:4000/vikendice/dohvatiUkupanBrojVikendica")
  }

  dohvatiSveMojeVikendice(vlasnik: Korisnik) {
    const data = {
      vlasnik: vlasnik
    }
    return this.httpClient.post<Vikendica[]>("http://localhost:4000/vikendice/dohvatiSveMojeVikendice", data)
  }

  obrisiVikendicu(id: number) {
    const data = {
      id: id
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/vikendice/obrisiVikendicu", data)
  }

  izmeniVikendicu(vikendica: Vikendica) {
    const formData = new FormData(); 
    formData.append("id", JSON.stringify(vikendica.id)); 
    formData.append("naziv", vikendica.naziv); 
    formData.append("mesto", vikendica.mesto); 
    formData.append("usluge", vikendica.usluge);
    formData.append("cenovnik_letnji", vikendica.cenovnik_letnji); 
    formData.append("cenovnik_zimski", vikendica.cenovnik_zimski); 
    formData.append("kontakt_telefon", vikendica.kontakt_telefon); 
    formData.append("koordinate", vikendica.koordinate); 
    formData.append("vlasnik", JSON.stringify(vikendica.vlasnik));
    
    vikendica.slike.forEach((slika) => {
      formData.append('slike', slika); 
    });

    return this.httpClient.post<Poruka>("http://localhost:4000/vikendice/izmeniVikendicu", formData)
  }

  dohvatiVikendiceSaLosimOcenama() {
    return this.httpClient.get<Vikendica[]>("http://localhost:4000/vikendice/dohvatiVikendiceSaLosimOcenama")
  }

  blokirajVikendicu(vikendica: Vikendica) {
    const data = {
      id: vikendica.id
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/vikendice/blokirajVikendicu", data)
  }

  odblokirajPotrebneVikendice() {
    return this.httpClient.get<Poruka>("http://localhost:4000/vikendice/odblokirajPotrebneVikendice")
  }
}
