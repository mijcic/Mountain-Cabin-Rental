import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Poruka } from '../models/poruka';
import { Korisnik } from '../models/korisnik';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  private httpClient = inject(HttpClient)

  constructor() { }

  proveriKorisnickoIme(korisnicko_ime: string) {
    const data = {
      korisnicko_ime: korisnicko_ime
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/korisnici/proveriKorisnickoIme", data)
  }

  proveriEmailAdresu(mejl: string) {
    const data = {
      mejl: mejl
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/korisnici/proveriEmailAdresu", data)
  }

  login(korisnicko_ime: string, lozinka: string) {
    const data = {
      korisnicko_ime: korisnicko_ime,
      lozinka: lozinka
    }

    return this.httpClient.post<Korisnik|Poruka>("http://localhost:4000/korisnici/login", data)
  }

  register(korisnik: Korisnik) {
    const formData = new FormData(); 
    formData.append("korisnicko_ime", korisnik.korisnicko_ime); 
    formData.append("lozinka", korisnik.lozinka); 
    formData.append("tip", korisnik.tip);
    formData.append("ime", korisnik.ime); 
    formData.append("prezime", korisnik.prezime); 
    formData.append("pol", korisnik.pol); 
    formData.append("adresa", korisnik.adresa); 
    formData.append("kontakt_telefon", korisnik.kontakt_telefon); 
    formData.append("mejl", korisnik.mejl); 
    formData.append("broj_kreditne_kartice", korisnik.broj_kreditne_kartice); 
    
    if (korisnik.profilna_slika) { 
      formData.append("profilna_slika", korisnik.profilna_slika); 
    }

    return this.httpClient.post<Poruka>("http://localhost:4000/korisnici/register", formData)
  }

  proveriLozinku(korisnicko_ime: string, lozinka: string) {
    const data = {
      korisnicko_ime: korisnicko_ime,
      lozinka: lozinka
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/korisnici/proveriLozinku", data)
  }

  promeniLozinkuKorisniku(korisnicko_ime: string, lozinka: string) {
    const data = {
      korisnicko_ime: korisnicko_ime,
      lozinka: lozinka
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/korisnici/promeniLozinkuKorisniku", data)
  }

  azurirajSlikuZaKorisnika(korisnik: Korisnik) {
    const formData = new FormData(); 
    formData.append("korisnicko_ime", korisnik.korisnicko_ime);  
    
    if (korisnik.profilna_slika) { 
      formData.append("profilna_slika", korisnik.profilna_slika); 
    }

    return this.httpClient.post<Korisnik|Poruka>("http://localhost:4000/korisnici/azurirajSlikuZaKorisnika", formData)
  }

  azurirajImeZaKorisnika(korisnik: Korisnik) {
    const data = {
      korisnicko_ime: korisnik.korisnicko_ime,
      ime: korisnik.ime
    }

    return this.httpClient.post<Korisnik>("http://localhost:4000/korisnici/azurirajImeZaKorisnika", data)
  }

  azurirajPrezimeZaKorisnika(korisnik: Korisnik) {
    const data = {
      korisnicko_ime: korisnik.korisnicko_ime,
      prezime: korisnik.prezime
    }

    return this.httpClient.post<Korisnik>("http://localhost:4000/korisnici/azurirajPrezimeZaKorisnika", data)
  }

  azurirajAdresuZaKorisnika(korisnik: Korisnik) {
    const data = {
      korisnicko_ime: korisnik.korisnicko_ime,
      adresa: korisnik.adresa
    }

    return this.httpClient.post<Korisnik>("http://localhost:4000/korisnici/azurirajAdresuZaKorisnika", data)
  }

  azurirajTelefonZaKorisnika(korisnik: Korisnik) {
    const data = {
      korisnicko_ime: korisnik.korisnicko_ime,
      kontakt_telefon: korisnik.kontakt_telefon
    }

    return this.httpClient.post<Korisnik>("http://localhost:4000/korisnici/azurirajTelefonZaKorisnika", data)
  }

  azurirajEMailZaKorisnika(korisnik: Korisnik) {
    const data = {
      korisnicko_ime: korisnik.korisnicko_ime,
      mejl: korisnik.mejl
    }

    return this.httpClient.post<Korisnik>("http://localhost:4000/korisnici/azurirajEMailZaKorisnika", data)
  }

  azurirajCCNZaKorisnika(korisnik: Korisnik) {
    const data = {
      korisnicko_ime: korisnik.korisnicko_ime,
      broj_kreditne_kartice: korisnik.broj_kreditne_kartice
    }

    return this.httpClient.post<Korisnik>("http://localhost:4000/korisnici/azurirajCCNZaKorisnika", data)
  }

  dohvatiUkupanBrojVlasnika() {
    return this.httpClient.get<Number>("http://localhost:4000/korisnici/dohvatiUkupanBrojVlasnika")
  }

  dohvatiUkupanBrojTurista() {
    return this.httpClient.get<Number>("http://localhost:4000/korisnici/dohvatiUkupanBrojTurista")
  }

  dohvatiSveVlasnike() {
    return this.httpClient.get<Korisnik[]>("http://localhost:4000/korisnici/dohvatiSveVlasnike")
  }

  dohvatiSveTuriste() {
    return this.httpClient.get<Korisnik[]>("http://localhost:4000/korisnici/dohvatiSveTuriste")
  }

  izmeniKorisnika(korisnik: Korisnik) {
    const formData = new FormData(); 
    formData.append("korisnicko_ime", korisnik.korisnicko_ime);
    formData.append("tip", korisnik.tip);
    formData.append("ime", korisnik.ime); 
    formData.append("prezime", korisnik.prezime); 
    formData.append("pol", korisnik.pol); 
    formData.append("adresa", korisnik.adresa); 
    formData.append("kontakt_telefon", korisnik.kontakt_telefon); 
    formData.append("broj_kreditne_kartice", korisnik.broj_kreditne_kartice); 
    
    if (korisnik.profilna_slika instanceof File) {
      formData.append("profilna_slika", korisnik.profilna_slika);
    }

    return this.httpClient.post<Poruka>("http://localhost:4000/korisnici/izmeniKorisnika", formData)
  }

  obrisiKorisnika(korisnicko_ime: string) {
    const data = {
      korisnicko_ime: korisnicko_ime
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/korisnici/obrisiKorisnika", data)
  }

  deaktivirajKorisnika(korisnicko_ime: string) {
    const data = {
      korisnicko_ime: korisnicko_ime
    }
    return this.httpClient.post<Poruka>("http://localhost:4000/korisnici/deaktivirajKorisnika", data)
  }
}
