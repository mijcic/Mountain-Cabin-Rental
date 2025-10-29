import { inject, Injectable } from '@angular/core';
import { ZahtevRegistracija } from '../models/zahtevRegistracija';
import { HttpClient } from '@angular/common/http';
import { Poruka } from '../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class ZahteviService {

  private httpClient = inject(HttpClient)

  constructor() { }

  dohvatiSveZahteveNaCekanju() {
    return this.httpClient.get<ZahtevRegistracija[]>("http://localhost:4000/zahtevi/dohvatiSveZahteveNaCekanju")
  }

  prihvatiZahtev(zahtev: ZahtevRegistracija) {
    const formData = new FormData(); 
    formData.append("korisnicko_ime", zahtev.korisnicko_ime); 
    formData.append("lozinka", zahtev.lozinka); 
    formData.append("tip", zahtev.tip);
    formData.append("ime", zahtev.ime); 
    formData.append("prezime", zahtev.prezime); 
    formData.append("pol", zahtev.pol); 
    formData.append("adresa", zahtev.adresa); 
    formData.append("kontakt_telefon", zahtev.kontakt_telefon); 
    formData.append("mejl", zahtev.mejl); 
    formData.append("broj_kreditne_kartice", zahtev.broj_kreditne_kartice);
    
    if (zahtev.profilna_slika) { 
      formData.append("profilna_slika", zahtev.profilna_slika); 
    }

    return this.httpClient.post<Poruka>("http://localhost:4000/zahtevi/prihvatiZahtev", formData)
  }

  odbijZahtev(korisnicko_ime: string) {
    const data = {
      korisnicko_ime: korisnicko_ime
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/zahtevi/odbijZahtev", data)
  }
}
