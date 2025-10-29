import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import { VikendicaService } from '../services/vikendica.service';
import { Korisnik } from '../models/korisnik';
import { Vikendica } from '../models/vikendica';
import { Rezervacija } from '../models/rezervacija';
import { RezervacijaService } from '../services/rezervacija.service';
import { CommonModule } from '@angular/common';
import { Recenzija } from '../models/recenzija';
import { RecenzijeService } from '../services/recenzije.service';

interface RezervacijaSaRecenzijom {
  rezervacija: Rezervacija;
  recenzija: Recenzija | null;
}

@Component({
  selector: 'app-turista',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './turista.component.html',
  styleUrl: './turista.component.css'
})
export class TuristaComponent {
  private vikendicaService = inject(VikendicaService)
  private korisnikService = inject(KorisnikService)
  private rezervacijeService = inject(RezervacijaService)
  private recenzijaService = inject(RecenzijeService)
  private router = inject(Router)

  activeSection: string = 'profil'; 

  ulogovan: Korisnik = new Korisnik()
  korisnik: Korisnik = new Korisnik()
  vikendica: Vikendica = new Vikendica()

  sveVikendice: Vikendica[] = []
  filtriraneVikendice: Vikendica[] = []

  filterNaziv = ''
  filterMesto = ''

  azuriranjeSlike = false
  azuriranjeImena = false
  azuriranjePrezimena = false
  azuriranjeAdrese = false
  azuriranjeTelefona  = false
  azuriranjeEMaila = false
  azuriranjeCCN = false
  message = ""
  messageSlika = ""
  messageIme = ""
  messagePrezime = ""
  messageAdresa = ""
  messageTelefon = ""
  messageEMail = ""
  messageCCN = ""
  putanjaSlike = ""

  mojeAktivneRezervacije: Rezervacija[] = []
  mojeArhiviraneRezervacije: Rezervacija[] = []

  novaRecenzija: Recenzija = new Recenzija()
  messageRecenzija = ""
  hoveredRating = 0
  mojeRecenzije: Recenzija[] = []
  ostavljanjeRecenzije = false
  rezervacijeSaRecenzijama: RezervacijaSaRecenzijom[] = [];

  prosecneOcene: { [id: number]: number } = {};
  floorOcene: { [id: number]: number } = {};

  messageOtkazivanje = ""

  aktivnaRezervacijaZaRecenziju: Rezervacija | null = null;

  ngOnInit() {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) this.ulogovan = JSON.parse(korisnik);

    Object.assign(this.korisnik, this.ulogovan)

    this.korisnik.broj_kreditne_kartice = this.ulogovan.broj_kreditne_kartice
    this.proveriKarticu()

    this.vikendicaService.sveVikendice().subscribe(data => {
      this.sveVikendice = data
      this.filtriraneVikendice = this.sveVikendice

      this.filtriraneVikendice.forEach(v => {
        this.recenzijaService.dohvatiProsecnuOcenuZaVikendicu(v).subscribe(ocena => {
          this.prosecneOcene[v.id] = Number(ocena);
        });
      });
    })

    this.rezervacijeService.dohvatiAktivneRezervacijeZaKorisnika(this.ulogovan).subscribe(data => {
      this.mojeAktivneRezervacije = data
    })

    this.rezervacijeService.dohvatiArhiviraneRezervacijeZaKorisnika(this.ulogovan).subscribe(data => {
      this.mojeArhiviraneRezervacije = data
      console.log(this.mojeArhiviraneRezervacije)

      this.recenzijaService.dohvatiSveRecenzijeZaKorisnika(this.ulogovan).subscribe(data => {
        this.mojeRecenzije = data

        this.rezervacijeSaRecenzijama = this.mojeArhiviraneRezervacije.map(r => ({
          rezervacija: r,
          recenzija: this.mojeRecenzije.find(rec => Number(rec.rezervacija?.id) === Number(r.id)) || null
        }));

        console.log(this.rezervacijeSaRecenzijama)
      })
    })

    this.vikendicaService.odblokirajPotrebneVikendice().subscribe()

    console.log(this.mojeArhiviraneRezervacije)
  }

  setAzuriranjeSlike() {
    this.azuriranjeSlike = true
  }

  setAzuriranjeImena() {
    this.azuriranjeImena = true
  }

  setAzuriranjePrezimena() {
    this.azuriranjePrezimena = true
  }

  setAzuriranjeAdrese() {
    this.azuriranjeAdrese = true
  }

  setAzuriranjeTelefona() {
    this.azuriranjeTelefona = true
  }

  setAzuriranjeEMaila() {
    this.azuriranjeEMaila = true
  }

  setAzuriranjeCCN() {
    this.azuriranjeCCN = true
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.messageSlika = "Dozvoljeni su samo JPG i PNG formati za profilnu sliku korisnika!"
      event.target.value = ""; 
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
        this.messageSlika = "Slika mora biti između 100x100px i 300x300px!"
        event.target.value = ""; 
        return;
      }
    }

    this.korisnik.profilna_slika = file;

    img.src = URL.createObjectURL(file);
  }

  azurirajSliku() {
    this.korisnik.korisnicko_ime = this.ulogovan.korisnicko_ime
    this.korisnikService.azurirajSlikuZaKorisnika(this.korisnik).subscribe(data => {
      if ('poruka' in data) {
        this.messageSlika = data.poruka
      }
      else {
        localStorage.setItem('ulogovan', JSON.stringify(data));
        let korisnik1 = localStorage.getItem('ulogovan');
        if (korisnik1 != null) this.ulogovan = JSON.parse(korisnik1);
        this.messageSlika = ""
      }
    })
  }

  azurirajIme() {
    var pocinjeVelikimSlovom = /^[A-Z][a-zA-Z]*$/;
    if (!pocinjeVelikimSlovom.test(this.korisnik.ime)) {
      this.messageIme = "Ime korisnika mora pocinjati velikim slovom i sadrzati samo slova!"
    }
    else {
      this.korisnik.korisnicko_ime = this.ulogovan.korisnicko_ime
      this.korisnikService.azurirajImeZaKorisnika(this.korisnik).subscribe(data => {
        if (data) {
          localStorage.setItem('ulogovan', JSON.stringify(data));
          let korisnik = localStorage.getItem('ulogovan');
          if (korisnik != null) this.ulogovan = JSON.parse(korisnik);
          this.messageIme = ""
        }
      })
      this.azuriranjeImena = false
    }
  }

  azurirajPrezime() {
    var pocinjeVelikimSlovom = /^[A-Z][a-zA-Z]*$/;
    if (!pocinjeVelikimSlovom.test(this.korisnik.prezime)) {
      this.message = "Prezime korisnika mora pocinjati velikim slovom i sadrzati samo slova!"
    }
    else {
      this.korisnik.korisnicko_ime = this.ulogovan.korisnicko_ime
      this.korisnikService.azurirajPrezimeZaKorisnika(this.korisnik).subscribe(data => {
        if (data) {
          localStorage.setItem('ulogovan', JSON.stringify(data));
          let korisnik = localStorage.getItem('ulogovan');
          if (korisnik != null) this.ulogovan = JSON.parse(korisnik);
          this.messagePrezime = ""
        }
      })
      this.azuriranjePrezimena = false
    }
  }

  azurirajAdresu() {
    var proveraAdresa = /^[A-Z][a-zA-Z\s]*,\s[A-Z][a-zA-Z\s]*\s\d+$/.test(this.korisnik.adresa);
    if (!proveraAdresa) {
      this.messageAdresa = "Adresa korisnika mora biti uneta u sledecem formatu: Grad, Ulica Broj!"
    }
    else {
      this.korisnik.korisnicko_ime = this.ulogovan.korisnicko_ime
      this.korisnikService.azurirajAdresuZaKorisnika(this.korisnik).subscribe(data => {
        if (data) {
          localStorage.setItem('ulogovan', JSON.stringify(data));
          let korisnik = localStorage.getItem('ulogovan');
          if (korisnik != null) this.ulogovan = JSON.parse(korisnik);
          this.messageAdresa = ""
        }
      })
      this.azuriranjeAdrese = false
    }
  }

  azurirajTelefon() {
    var proveraKontaktTelefon1 = /^(06\d{7,8}|\+3816\d{7,8})$/.test(this.korisnik.kontakt_telefon);
    var samoCifre = /^\d+$/.test(this.korisnik.kontakt_telefon.replace('+',''));
    if (!proveraKontaktTelefon1) {
      this.messageTelefon = "Kontakt telefon korisnika mora pocinjati sa 06 ili sa +381 i biti u odgovarajucem formatu!"
    }
    else if (!samoCifre) {
      this.messageTelefon = "Kontakt telefon korisnika mora sadrzati samo cifre!"
    }
    else {
      this.korisnik.korisnicko_ime = this.ulogovan.korisnicko_ime
      this.korisnikService.azurirajTelefonZaKorisnika(this.korisnik).subscribe(data => {
        if (data) {
          localStorage.setItem('ulogovan', JSON.stringify(data));
          let korisnik = localStorage.getItem('ulogovan');
          if (korisnik != null) this.ulogovan = JSON.parse(korisnik);
          this.messageTelefon = ""
        }
      })
      this.azuriranjeTelefona = false
    }
  }

  azurirajEMail() {
    var proveraEMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.korisnik.mejl);
    if (!proveraEMail) {
      this.messageEMail = "Email korisnika mora biti u odgovarajucem formatu! (npr. korisnik@domen.rs)"
    }
    else {
      this.korisnikService.proveriEmailAdresu(this.korisnik.mejl).subscribe(data => {
        if (data.poruka == "Vec postoji!" && this.ulogovan.mejl != this.korisnik.mejl) {
          this.messageEMail = "Korisnik sa ovom email adresom vec postoji!"
        }
        else { 
          this.korisnik.korisnicko_ime = this.ulogovan.korisnicko_ime
          this.korisnikService.azurirajEMailZaKorisnika(this.korisnik).subscribe(data => {
            if (data) {
              localStorage.setItem('ulogovan', JSON.stringify(data));
              let korisnik = localStorage.getItem('ulogovan');
              if (korisnik != null) this.ulogovan = JSON.parse(korisnik);
              this.messageEMail = ""
            }
          })
          this.azuriranjeEMaila = false
        }
      })
    }
  }

  azurirajCCN() {
    var diners12Regex = /^(300|301|302|303)\d{12}$/;
    var diners13Regex = /^(36|38)\d{13}$/;
    var mastercardRegex = /^(5[1-5])\d{14}$/;
    var visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;
    if (!diners12Regex.test(this.korisnik.broj_kreditne_kartice) && !diners13Regex.test(this.korisnik.broj_kreditne_kartice) &&
      !mastercardRegex.test(this.korisnik.broj_kreditne_kartice) && !visaRegex.test(this.korisnik.broj_kreditne_kartice)) {
        this.messageCCN = "Nevalidan broj kartice!"
      }
    else {
      this.korisnik.korisnicko_ime = this.ulogovan.korisnicko_ime
      this.korisnikService.azurirajCCNZaKorisnika(this.korisnik).subscribe(data => {
        if (data) {
          localStorage.setItem('ulogovan', JSON.stringify(data));
          let korisnik = localStorage.getItem('ulogovan');
          if (korisnik != null) this.ulogovan = JSON.parse(korisnik);
          this.messageCCN = ""
        }
      })
      this.azuriranjeCCN = false
    }
  }

  proveriKarticu() {
    var diners12Regex = /^(300|301|302|303)\d{12}$/;
    var diners13Regex = /^(36|38)\d{13}$/;
    var mastercardRegex = /^(5[1-5])\d{14}$/;
    var visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;
    if (diners12Regex.test(this.korisnik.broj_kreditne_kartice) || diners13Regex.test(this.korisnik.broj_kreditne_kartice)) {
      this.putanjaSlike = "assets/diners-logo.jpg"
    }
    else if (mastercardRegex.test(this.korisnik.broj_kreditne_kartice)) {
      this.putanjaSlike = "assets/master-card-logo.jpg"
    }
    else if (visaRegex.test(this.korisnik.broj_kreditne_kartice)) {
      this.putanjaSlike = "assets/visa-logo.jpg"
    }
    else {
      this.putanjaSlike = ""
    }
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

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  odjaviSe() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  setRating(value: number) {
    this.novaRecenzija.ocena = value;
  }

  hoverRating(value: number) {
    this.hoveredRating = value;
  }

  ostaviRecenziju(rezervacija: Rezervacija | null) { 
    if (rezervacija) {
      this.novaRecenzija.korisnik = this.ulogovan
      this.novaRecenzija.rezervacija = rezervacija
      if (this.novaRecenzija.ocena == 0 || this.novaRecenzija.komentar == "") {
        this.messageRecenzija = "Morate uneti ocenu i komentar!"
      }
      else {
        this.recenzijaService.ostaviRecenziju(this.novaRecenzija).subscribe(data => {
          this.messageRecenzija = data.poruka
          this.ostavljanjeRecenzije = false

          this.rezervacijeService.dohvatiArhiviraneRezervacijeZaKorisnika(this.ulogovan).subscribe(data => {
            this.mojeArhiviraneRezervacije = data

            this.recenzijaService.dohvatiSveRecenzijeZaKorisnika(this.ulogovan).subscribe(data => {
              this.mojeRecenzije = data

              this.rezervacijeService.dohvatiArhiviraneRezervacijeZaKorisnika(this.ulogovan).subscribe(data => {
                this.mojeArhiviraneRezervacije = data
              })

              this.recenzijaService.dohvatiSveRecenzijeZaKorisnika(this.ulogovan).subscribe(data => {
                this.mojeRecenzije = data

                this.rezervacijeSaRecenzijama = this.mojeArhiviraneRezervacije.map(r => ({
                  rezervacija: r,
                  recenzija: this.mojeRecenzije.find(rec => Number(rec.rezervacija?.id) === Number(r.id)) || null
                }));
              })
            })
          })
        })
      }
    }
  }

  ostavljanjeRecenzijeF(rezervacija: Rezervacija) {
    this.ostavljanjeRecenzije = true
    this.aktivnaRezervacijaZaRecenziju = this.ostavljanjeRecenzije ? rezervacija : null;
  }

  dohvatiProsecnuOcenuZaPrikaz(v: Vikendica): number {
    return this.prosecneOcene[v.id] ?? 0;
  }

  izracunajFloorOcene() {
    for (let id in this.prosecneOcene) {
      this.floorOcene[id] = Math.floor(this.prosecneOcene[id] || 0);
    }

    for (let id in this.floorOcene) {
      console.log( this.floorOcene[id]);
    }
  }

  getStars(ocena: number | null): ('full' | 'half' | 'empty')[] {
    if (!ocena) return Array(5).fill('empty');

    const stars: ('full' | 'half' | 'empty')[] = [];
    for (let i = 1; i <= 5; i++) {
      if (ocena >= i) {
        stars.push('full');
      } else if (ocena >= i - 0.5) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  otkaziRezervaciju(rezervacija: Rezervacija) {
    this.rezervacijeService.otkaziRezervaciju(rezervacija).subscribe(data => {
      this.messageOtkazivanje = data.poruka

      console.log(this.messageOtkazivanje)

      this.rezervacijeService.dohvatiAktivneRezervacijeZaKorisnika(this.ulogovan).subscribe(data => {
        this.mojeAktivneRezervacije = data
      })
    })
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
