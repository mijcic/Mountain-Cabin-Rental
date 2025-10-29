import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import { Korisnik } from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { ZahteviService } from '../services/zahtevi.service';
import { ZahtevRegistracija } from '../models/zahtevRegistracija';
import { Vikendica } from '../models/vikendica';
import { VikendicaService } from '../services/vikendica.service';
import { CommonModule } from '@angular/common';

interface VikendicaSaFlagom {
  vikendica: Vikendica; 
  losa: number;          
}

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.css'
})
export class AdministratorComponent {
  private korisnikService = inject(KorisnikService)
  private zahteviService = inject(ZahteviService)
  private vikendicaService = inject(VikendicaService)
  private router = inject(Router)

  sviVlasnici: Korisnik[] = []
  sviTuristi: Korisnik[] = []

  korisnik: Korisnik = new Korisnik()
  putanjaSlike = ""

  izmenaVlasnika = false
  izmenaTuriste = false
  korisnikIzmena: Korisnik = new Korisnik()
  messageIzmena = ""
  messageInfo1 = ""
  messageInfo2 = ""

  activeSection: string = 'svi korisnici'; 

  sviZahtevi: ZahtevRegistracija[] = []

  sveVikendice: Vikendica[] = []
  sveLoseVikendice: Vikendica[] = []
  vikendiceSaFlagom: VikendicaSaFlagom[] = []
  messageBlokiranje = ""

  ngOnInit() {
    this.korisnikService.dohvatiSveVlasnike().subscribe(data => {
      this.sviVlasnici = data
    })

    this.korisnikService.dohvatiSveTuriste().subscribe(data => {
      this.sviTuristi = data
    })

    this.zahteviService.dohvatiSveZahteveNaCekanju().subscribe(data => {
      this.sviZahtevi = data
    })

    this.vikendicaService.sveVikendice().subscribe(data => {
      this.sveVikendice = data
    })

    this.vikendicaService.dohvatiVikendiceSaLosimOcenama().subscribe(data => {
      this.sveLoseVikendice = data

      this.vikendiceSaFlagom = this.sveVikendice.map(v => ({
        vikendica: v,
        losa: this.sveLoseVikendice.some(l => l.id === v.id) ? 1 : 0
      }));

      console.log(this.vikendiceSaFlagom)
    })

    this.vikendicaService.odblokirajPotrebneVikendice().subscribe()
  }

  proveriKarticu() {
    var diners12Regex = /^(300|301|302|303)\d{12}$/;
    var diners13Regex = /^(36|38)\d{13}$/;
    var mastercardRegex = /^(5[1-5])\d{14}$/;
    var visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;
    if (diners12Regex.test(this.korisnikIzmena.broj_kreditne_kartice) || diners13Regex.test(this.korisnikIzmena.broj_kreditne_kartice)) {
      this.putanjaSlike = "assets/diners-logo.jpg"
    }
    else if (mastercardRegex.test(this.korisnikIzmena.broj_kreditne_kartice)) {
      this.putanjaSlike = "assets/master-card-logo.jpg"
    }
    else if (visaRegex.test(this.korisnikIzmena.broj_kreditne_kartice)) {
      this.putanjaSlike = "assets/visa-logo.jpg"
    }
    else {
      this.putanjaSlike = ""
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.messageIzmena = "Dozvoljeni su samo JPG i PNG formati za profilnu sliku korisnika!"
      event.target.value = ""; 
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
        this.messageIzmena = "Slika mora biti između 100x100px i 300x300px!"
        event.target.value = ""; 
        return;
      }
    }

    this.korisnikIzmena.profilna_slika = file;

    img.src = URL.createObjectURL(file);
  }

  izmenaVlasnikaF(korisnik: Korisnik) {
    Object.assign(this.korisnikIzmena, korisnik)
    this.izmenaVlasnika = true
  }

  izmenaTuristeF(korisnik: Korisnik) { 
    Object.assign(this.korisnikIzmena, korisnik)
    this.izmenaTuriste = true
  }

  sacuvajIzmene() {
    if (this.korisnikIzmena.korisnicko_ime != "" && this.korisnikIzmena.lozinka != "" && this.korisnikIzmena.tip != "" && this.korisnikIzmena.ime != "" &&
      this.korisnikIzmena.prezime != "" && this.korisnikIzmena.pol != "" && this.korisnikIzmena.adresa != "" && this.korisnikIzmena.kontakt_telefon != "" &&
      this.korisnikIzmena.mejl != "" && this.korisnikIzmena.broj_kreditne_kartice != ""
    ) {
      this.messageIzmena = ""
      var korisnickoImeRegex = /^[a-z0-9_.]{3,}$/;
      if (!korisnickoImeRegex.test(this.korisnikIzmena.korisnicko_ime)) {
        this.messageIzmena = "Korisnicko ime nije u odgovarajucem formatu: mora imati najmanje 3 karaktera i moze sadrzati samo mala slova, brojeve, donju crtu (_) i tacku(.)!"
      }
      else {
        var pocinjeVelikimSlovom = /^[A-Z].*/;
        if (!pocinjeVelikimSlovom.test(this.korisnikIzmena.ime)) {
          this.messageIzmena = "Ime korisnika mora pocinjati velikim slovom!"
        }
        else {
          if (!pocinjeVelikimSlovom.test(this.korisnikIzmena.prezime)) {
            this.messageIzmena = "Prezime korisnika mora pocinjati velikim slovom!"
          }
          else {
            var proveraAdresa = /^[A-Z][a-zA-Z\s]*,\s[A-Z][a-zA-Z\s]*\s\d+$/.test(this.korisnikIzmena.adresa);
            if (!proveraAdresa) {
              this.messageIzmena = "Adresa korisnika mora biti uneta u sledecem formatu: Grad, Ulica Broj!"
            }
            else {
              var proveraKontaktTelefon1 = /^(06\d{7,8}|\+3816\d{7,8})$/.test(this.korisnikIzmena.kontakt_telefon);
              var samoCifreKontaktTelefon = /^\d+$/.test(this.korisnikIzmena.kontakt_telefon.replace('+',''));

              if (!proveraKontaktTelefon1) {
                this.messageIzmena = "Kontakt telefon vikendice mora pocinjati sa 06 ili sa +381 i biti u odgovarajucem formatu!"
              }
              else if (!samoCifreKontaktTelefon) {
                this.messageIzmena = "Kontakt telefon vikendice mora sadrzati samo cifre!"
              }
              else {
                var diners12Regex = /^(300|301|302|303)\d{12}$/;
                var diners13Regex = /^(36|38)\d{13}$/;
                var mastercardRegex = /^(5[1-5])\d{14}$/;
                var visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;
                if (!diners12Regex.test(this.korisnikIzmena.broj_kreditne_kartice) && !diners13Regex.test(this.korisnikIzmena.broj_kreditne_kartice) &&
                  !mastercardRegex.test(this.korisnikIzmena.broj_kreditne_kartice) && !visaRegex.test(this.korisnikIzmena.broj_kreditne_kartice)) {
                    this.messageIzmena = "Broj kartice nije validan!"
                  }
                else {
                  this.korisnikService.izmeniKorisnika(this.korisnikIzmena).subscribe(data => {
                    this.messageIzmena = data.poruka
                    if (data.poruka == "Uspesna promena korisnika!") {
                      this.korisnikService.dohvatiSveVlasnike().subscribe(data => {
                        this.sviVlasnici = data
                      })

                      this.korisnikService.dohvatiSveTuriste().subscribe(data => {
                        this.sviTuristi = data
                      })

                      this.izmenaVlasnika = false
                      this.izmenaTuriste = false
                      this.activeSection = "svi korisnici"
                    }
                  })
                }
              }
            }
          }
        }
      }
    }
    else {
      this.messageIzmena = "Niste uneli sve podatke u formu!"
    }
  }

  otkaziIzmeneVlasnika() {
    this.izmenaVlasnika = false
  }

  otkaziIzmeneTuriste() {
    this.izmenaTuriste = false
  }

  obrisiKorisnika(korisnik: Korisnik) {
    this.korisnikService.obrisiKorisnika(korisnik.korisnicko_ime).subscribe(data => {
      if (data.poruka == "Uspesno obrisan korisnik!") {
        if (korisnik.tip == "vlasnik") this.messageInfo1 = data.poruka
        else if (korisnik.tip == "turista") this.messageInfo2 = data.poruka

        this.korisnikService.dohvatiSveVlasnike().subscribe(data => {
          this.sviVlasnici = data
        })

        this.korisnikService.dohvatiSveTuriste().subscribe(data => {
          this.sviTuristi = data
        })
      }
    })
  }

  deaktivirajKorisnika(korisnik: Korisnik) { 
    this.korisnikService.deaktivirajKorisnika(korisnik.korisnicko_ime).subscribe(data => {
      if (korisnik.tip == "vlasnik") this.messageInfo1 = data.poruka
      else if (korisnik.tip == "turista") this.messageInfo2 = data.poruka

      this.korisnikService.dohvatiSveVlasnike().subscribe(data => {
        this.sviVlasnici = data
      })

      this.korisnikService.dohvatiSveTuriste().subscribe(data => {
        this.sviTuristi = data
      })
    })
  }

  odobriZahtev(zahtev: ZahtevRegistracija) {
    this.zahteviService.prihvatiZahtev(zahtev).subscribe(data => {
      this.messageIzmena = data.poruka

      this.korisnikService.dohvatiSveVlasnike().subscribe(data => {
        this.sviVlasnici = data
      })

      this.korisnikService.dohvatiSveTuriste().subscribe(data => {
        this.sviTuristi = data
      })

      this.zahteviService.dohvatiSveZahteveNaCekanju().subscribe(data => {
        this.sviZahtevi = data
      })
    })
  }

  odbijZahtev(zahtev: ZahtevRegistracija) {
    this.zahteviService.odbijZahtev(zahtev.korisnicko_ime).subscribe(data => {
      this.messageIzmena = data.poruka

      this.korisnikService.dohvatiSveVlasnike().subscribe(data => {
        this.sviVlasnici = data
      })

      this.korisnikService.dohvatiSveTuriste().subscribe(data => {
        this.sviTuristi = data
      })

      this.zahteviService.dohvatiSveZahteveNaCekanju().subscribe(data => {
        this.sviZahtevi = data
      })
    })
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  odjaviSe() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  blokirajVikendicu(vikendica: Vikendica) {
    this.vikendicaService.blokirajVikendicu(vikendica).subscribe(data => {
      this.messageBlokiranje = data.poruka

      if (data.poruka == "Uspesno blokirana vikendica!") {
        this.vikendicaService.sveVikendice().subscribe(data => {
          this.sveVikendice = data
        })

        this.vikendicaService.dohvatiVikendiceSaLosimOcenama().subscribe(data => {
          this.sveLoseVikendice = data

          this.vikendiceSaFlagom = this.sveVikendice.map(v => ({
            vikendica: v,
            losa: this.sveLoseVikendice.some(l => l.id === v.id) ? 1 : 0
          }));
        })
      }
    })
  }
}
