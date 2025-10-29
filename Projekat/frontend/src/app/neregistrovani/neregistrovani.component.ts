import { Component, inject } from '@angular/core';
import { VikendicaService } from '../services/vikendica.service';
import { Vikendica } from '../models/vikendica';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../services/korisnik.service';
import { RezervacijaService } from '../services/rezervacija.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-neregistrovani',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './neregistrovani.component.html',
  styleUrl: './neregistrovani.component.css'
})
export class NeregistrovaniComponent {
  private vikendicaService = inject(VikendicaService)
  private korisnikService = inject(KorisnikService)
  private rezervacijaService = inject(RezervacijaService)
  
  sveVikendice: Vikendica[] = []
  filtriraneVikendice: Vikendica[] = []

  filterNaziv = ''
  filterMesto = ''

  ukupanBrojVikendica = new Number()
  ukupanBrojVlasnika = new Number()
  ukupanBrojTurista = new Number()
  rezervacijeZadnjih24h = new Number()
  rezervacijeZadnjih7Dana = new Number()
  rezervacijeZadnjih30Dana = new Number()

  activeSection: string = "opste informacije"

  ngOnInit() {
    this.vikendicaService.sveVikendice().subscribe(data => {
      this.sveVikendice = data
      this.filtriraneVikendice = this.sveVikendice
    })

    this.vikendicaService.dohvatiUkupanBrojVikendica().subscribe(data => {
      this.ukupanBrojVikendica = data
    })

    this.korisnikService.dohvatiUkupanBrojVlasnika().subscribe(data => {
      this.ukupanBrojVlasnika = data
    })

    this.korisnikService.dohvatiUkupanBrojTurista().subscribe(data => {
      this.ukupanBrojTurista = data
    })

    this.rezervacijaService.dohvatiBrojRezervacijaUPoslednjih24h().subscribe(data => {
      this.rezervacijeZadnjih24h = data
    })

    this.rezervacijaService.dohvatiBrojRezervacijaUPoslednjih7Dana().subscribe(data => {
      this.rezervacijeZadnjih7Dana = data
    })

    this.rezervacijaService.dohvatiBrojRezervacijaUPoslednjih30Dana().subscribe(data => {
      this.rezervacijeZadnjih30Dana = data
    })

    this.vikendicaService.odblokirajPotrebneVikendice().subscribe()
  }

  primeniFilter() {
    this.filtriraneVikendice = this.sveVikendice.filter(v =>
      (!this.filterNaziv || v.naziv.toLowerCase().includes(this.filterNaziv.toLowerCase())) &&
      (!this.filterMesto || v.mesto.toLowerCase().includes(this.filterMesto.toLowerCase()))
    )
  }

  resetujFilter() {
    this.filterNaziv = ''
    this.filterMesto = ''
    this.filtriraneVikendice = this.sveVikendice
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  sortiraj(kolona: 'naziv' | 'mesto', smer: 'asc' | 'desc') {
    this.filtriraneVikendice.sort((a, b) => {
      let valA = a[kolona].toLowerCase();
      let valB = b[kolona].toLowerCase();
      if (valA < valB) return smer === 'asc' ? -1 : 1;
      if (valA > valB) return smer === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
