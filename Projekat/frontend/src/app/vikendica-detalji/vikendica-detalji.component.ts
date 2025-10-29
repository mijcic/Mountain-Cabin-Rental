import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vikendica } from '../models/vikendica';
import { VikendicaService } from '../services/vikendica.service';
import { Rezervacija } from '../models/rezervacija';
import { FormsModule } from '@angular/forms';
import { Korisnik } from '../models/korisnik';
import { RezervacijaService } from '../services/rezervacija.service';
import * as L from 'leaflet';
import { Recenzija } from '../models/recenzija';
import { RecenzijeService } from '../services/recenzije.service';

@Component({
  selector: 'app-vikendica-detalji',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vikendica-detalji.component.html',
  styleUrl: './vikendica-detalji.component.css'
})
export class VikendicaDetaljiComponent {
  private route = inject(ActivatedRoute)
  private vikendicaService = inject(VikendicaService)
  private rezervacijaService = inject(RezervacijaService)
  private recenzijaService = inject(RecenzijeService)
  private router = inject(Router)

  vikendica: Vikendica = new Vikendica()
  slikeZaPrikaz: File[] = []

  trenutnaSlikaIndex = 0;
  trenutnaSlika: File | null = null;

  step = 1;
  rezervacija: Rezervacija = new Rezervacija()
  message = ""
  ulogovan: Korisnik = new Korisnik()

  sveRecenzije: Recenzija[] = []

  today: string = '';

  ngOnInit() {
    const naziv = this.route.snapshot.paramMap.get('naziv');

    if (naziv) {
      this.vikendicaService.dohvatiVikendicuPoNazivu(naziv).subscribe(data => {
        this.vikendica = data
        this.slikeZaPrikaz = this.vikendica.slike

        this.trenutnaSlikaIndex = (this.trenutnaSlikaIndex + 1) % this.slikeZaPrikaz.length;
        this.trenutnaSlika = this.slikeZaPrikaz[this.trenutnaSlikaIndex];
        
        setTimeout(() => this.initMap(), 0);

        this.recenzijaService.dohvatiRecenzijeZaVikendicu(this.vikendica).subscribe(data => {
          this.sveRecenzije = data
        })
      })

      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      this.today = now.toISOString().slice(0, 16);
    }

    setInterval(() => {
      this.trenutnaSlikaIndex = (this.trenutnaSlikaIndex + 1) % this.slikeZaPrikaz.length;
      this.trenutnaSlika = this.slikeZaPrikaz[this.trenutnaSlikaIndex];
    }, 2500);

    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) this.ulogovan = JSON.parse(korisnik);
    this.rezervacija.broj_kreditne_kartice = this.ulogovan.broj_kreditne_kartice

    this.vikendicaService.odblokirajPotrebneVikendice().subscribe()
  }

  nextStep() {
    if (this.rezervacija.datum_pocetka == null) {
      this.message = "Niste uneli datum pocetka rezervacije!"
    }
    else if (this.rezervacija.datum_kraja == null) {
      this.message = "Niste uneli datum kraja rezervacije!"
    }
    else {
      const pocetak = new Date(this.rezervacija.datum_pocetka);
      const kraj = new Date(this.rezervacija.datum_kraja);

      if (pocetak >= kraj) {
        this.message = "Datum pocetka rezervacije ne moze biti nakon datuma kraja rezervacije!"
      }
      else if (pocetak.getHours() < 14) {
        this.message = "Ulazak u vikendicu je moguc tek od 14 casova!"
      }
      else if (kraj.getHours() > 10 || (kraj.getHours() === 10 && kraj.getMinutes() > 0)) {
        this.message = "Morate napustiti vikendicu do 10 casova!"
      }
      else if (this.rezervacija.odrasli_broj == 0) {
        this.message = "Minimalan broj odraslih osoba je 1!"
      }
      else if (this.rezervacija.odrasli_broj < 0 || this.rezervacija.deca_broj < 0) {
        this.message = "Greska pri popunjavanju!"
      }
      else {
        this.rezervacija.cena = this.izracunajCenu() * (this.rezervacija.deca_broj + this.rezervacija.odrasli_broj);
        this.step = 2;
        this.message = ""
      }
    }
  }

  potvrdiRezervaciju() {
    if (this.rezervacija.broj_kreditne_kartice == "") {
      this.message = "Morate uneti broj kreditne kartice kojom placate!"
    }
    else {
      var diners12Regex = /^(300|301|302|303)\d{12}$/;
      var diners13Regex = /^(36|38)\d{13}$/;
      var mastercardRegex = /^(5[1-5])\d{14}$/;
      var visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;
      if (!diners12Regex.test(this.rezervacija.broj_kreditne_kartice) && !diners13Regex.test(this.rezervacija.broj_kreditne_kartice) &&
        !mastercardRegex.test(this.rezervacija.broj_kreditne_kartice) && !visaRegex.test(this.rezervacija.broj_kreditne_kartice)) {
          this.message = "Broj kartice nije validan!"
      }
      else {
        this.rezervacija.rezervant = this.ulogovan
        this.rezervacija.vikendica = this.vikendica
        this.rezervacija.datum_rezervacije = new Date()
        this.rezervacijaService.dodajRezervaciju(this.rezervacija).subscribe(data => {
          this.message = data.poruka
          if (this.message == "Uspesno dodata rezervacija!") {
            this.rezervacija = new Rezervacija()
            this.step = 1
          }
        })
      }
    }
  }

  formatDate(date: Date | null): string {
    if (!date) return '';

    const d = new Date(date);

    const dan = d.getDate().toString().padStart(2, '0');
    const mesec = (d.getMonth() + 1).toString().padStart(2, '0');
    const godina = d.getFullYear();

    const sati = d.getHours().toString().padStart(2, '0');
    const minuti = d.getMinutes().toString().padStart(2, '0');

    return `${dan}.${mesec}.${godina}. u ${sati}:${minuti}`;
  }

  brojNocenja(): number {
    if (!this.rezervacija.datum_pocetka || !this.rezervacija.datum_kraja) return 0;

    const pocetak = new Date(this.rezervacija.datum_pocetka);
    const kraj = new Date(this.rezervacija.datum_kraja);

    const diffMs = kraj.getTime() - pocetak.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  izracunajCenu(): number {
    if (!this.rezervacija.datum_pocetka || !this.rezervacija.datum_kraja) return 0;

    const letnjiMeseci = [5, 6, 7, 8]; 
    const mesecPocetka = new Date(this.rezervacija.datum_pocetka).getMonth() + 1;
    const nocenja = this.brojNocenja();

    let cenaPoNoci: number;

    if (letnjiMeseci.includes(mesecPocetka)) {
      cenaPoNoci = Number(this.vikendica.cenovnik_letnji);
    } else {
      cenaPoNoci = Number(this.vikendica.cenovnik_zimski);
    }

    return nocenja * cenaPoNoci;
  }

  odjaviSe() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  initMap(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });

    const coords = this.vikendica.koordinate.split(',');

    if (coords.length == 2) {
      const latitude = parseFloat(coords[0]);
      const longitude = parseFloat(coords[1]);

      const map = L.map('map').setView([latitude, longitude], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`${this.vikendica.naziv}, ${this.vikendica.mesto}`)
        .openPopup();
      
      setTimeout(() => map.invalidateSize(), 200);
    }
  }
}
