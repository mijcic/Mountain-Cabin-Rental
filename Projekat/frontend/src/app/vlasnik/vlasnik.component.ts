import { Component, inject, Pipe } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Korisnik } from '../models/korisnik';
import { Vikendica } from '../models/vikendica';
import { FormsModule } from '@angular/forms';
import { VikendicaService } from '../services/vikendica.service';
import { KorisnikService } from '../services/korisnik.service';
import { Rezervacija } from '../models/rezervacija';
import { RezervacijaService } from '../services/rezervacija.service';
import { DatePipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-vlasnik',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, FullCalendarModule, BaseChartDirective ],
  templateUrl: './vlasnik.component.html',
  styleUrl: './vlasnik.component.css'
})
export class VlasnikComponent {

  private vikendicaService = inject(VikendicaService)
  private korisnikService = inject(KorisnikService)
  private rezervacijaService = inject(RezervacijaService)
  private router = inject(Router)

  ulogovan: Korisnik = new Korisnik()
  korisnik: Korisnik = new Korisnik()
  vikendica: Vikendica = new Vikendica()

  azuriranjeSlike = false
  azuriranjeImena = false
  azuriranjePrezimena = false
  azuriranjeAdrese = false
  azuriranjeTelefona  = false
  azuriranjeEMaila = false
  message = ""
  messageSlika = ""
  messageIme = ""
  messagePrezime = ""
  messageAdresa = ""
  messageTelefon = ""
  messageEMail = ""

  neobradjeneRezervacije: Rezervacija[] = []
  messageRezervacije = ""

  sveMojeVikendice: Vikendica[] = []
  messageVikendice = ""
  izmenaVikendice = false
  izabranaVikendicaZaIzmenu: Vikendica = new Vikendica()
  currentVikendica: Vikendica = new Vikendica()
  newFiles: File[] = [];

  activeSection: string = 'profil'; 

  prikaziDijalog: boolean = false;
  izabranaRezervacija: any = null;

  // KALENDAR
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    height: 'auto',
    displayEventTime: false,
    eventClick: this.onEventClick.bind(this),
    events: [] 
  };

  // BAR CHART
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
    datasets: []
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false, text: 'Broj rezervacija po mesecima' }
    }
  };

  // PIE CHART
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom'},
      title: { display: true, text: 'Odnos vikend / radna nedelja' }
    }
  };

  pieCharts: { naziv: string; data: any }[] = [];

  ngOnInit() {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) this.ulogovan = JSON.parse(korisnik);

    Object.assign(this.korisnik, this.ulogovan)

    this.rezervacijaService.dohvatiNeobradjeneRezervacijeZaMojeVikendice(this.ulogovan).subscribe(data => {
      this.neobradjeneRezervacije = data
    })

    this.vikendicaService.dohvatiSveMojeVikendice(this.ulogovan).subscribe(data => {
      this.sveMojeVikendice = data
    })

    this.rezervacijaService.dohvatiSveRezervacijeZaMojeVikendice(this.ulogovan).subscribe(data => {
      // Kalendar
      const neobradjene = data.filter((r: any) => r.status === 'neobradjena').map((r: any) => ({
        title: `${r.vikendica?.naziv} 🏡 ${r.rezervant?.ime} ${r.rezervant?.prezime}`,
        start: r.datum_pocetka,
        end: r.datum_kraja,
        color: 'gold',
        extendedProps: { rezervacija: r }
      }));

      const potvrdjene = data.filter((r: any) => r.status === 'potvrdjena').map((r: any) => ({
        title: `${r.vikendica?.naziv} 🏡 ${r.rezervant?.ime} ${r.rezervant?.prezime}`,
        start: r.datum_pocetka,
        end: r.datum_kraja,
        color: 'green',
        extendedProps: { rezervacija: r }
      }));

      this.calendarOptions.events = [...neobradjene, ...potvrdjene,];

      // Statistika
      const groupedByVikendica: { [key: string]: number[] } = {};
      const weekendWeekdayCounts: { [key: string]: { weekend: number; weekday: number } } = {};

      data.forEach((rez: any) => {
        const naziv = rez.vikendica?.naziv || 'Nepoznata';
        const startDate = new Date(rez.datum_pocetka);
        const mesec = startDate.getMonth(); 

        if (!groupedByVikendica[naziv]) groupedByVikendica[naziv] = new Array(12).fill(0);
        groupedByVikendica[naziv][mesec]++;

        const dan = startDate.getDay();
        const jeVikend = (dan === 0 || dan === 6);
        if (!weekendWeekdayCounts[naziv]) weekendWeekdayCounts[naziv] = { weekend: 0, weekday: 0 };
        if (jeVikend) weekendWeekdayCounts[naziv].weekend++;
        else weekendWeekdayCounts[naziv].weekday++;
      });

      this.barChartData.datasets = Object.keys(groupedByVikendica).map(naziv => ({
        label: naziv,
        data: groupedByVikendica[naziv]
      }));

      const pieLabels: string[] = [];
      const pieData: number[] = [];

      Object.entries(weekendWeekdayCounts).forEach(([naziv, counts]) => {
        pieLabels.push(`Vikend - ${naziv}`);
        pieLabels.push(`Radna nedelja - ${naziv}`);
        pieData.push(counts.weekend);
        pieData.push(counts.weekday);
      });

      this.pieCharts = this.sveMojeVikendice.map(vikendica => {
        const counts = weekendWeekdayCounts[vikendica.naziv] || { weekend: 0, weekday: 0 };
        
        return {
          naziv: vikendica.naziv,
          data: {
            labels: ['Vikend', 'Radna nedelja'],
            datasets: [
              {
                data: [counts.weekend, counts.weekday],
                backgroundColor: ['#ADD8E6', '#FFB6C1'],
                borderColor: '#ccc', 
                borderWidth: 1
              }
            ]
          },
          type: 'doughnut'
        };
      });
    })

    this.vikendicaService.odblokirajPotrebneVikendice().subscribe()
  }

  dodajVikendicu() {
    if (this.vikendica.naziv == "" || this.vikendica.mesto == "" || this.vikendica.cenovnik_letnji == "" || 
    this.vikendica.cenovnik_zimski == "" || this.vikendica.kontakt_telefon == "" || this.vikendica.koordinate == "") {
      this.message = "Niste uneli sve neophodne podatke!"
    }
    else {
      let regexPrvoPocetno = /^[A-Z].*/;
      var sadrziSamoSlova = /^[A-Z][a-zA-Z]*$/;
      var proveraKontaktTelefon1 = /^(06\d{7,8}|\+3816\d{7,8})$/.test(this.vikendica.kontakt_telefon);
      var samoCifreKontaktTelefon = /^\d+$/.test(this.vikendica.kontakt_telefon.replace('+',''));
      var proveraCena1 = /^\d+$/.test(this.vikendica.cenovnik_letnji);
      var proveraCena2 = /^\d+$/.test(this.vikendica.cenovnik_zimski);
      var koordinataRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(this.vikendica.koordinate);
      
      if (!regexPrvoPocetno.test(this.vikendica.naziv)) {  
        this.message = "Naziv vikendice mora pocinjati velikim slovom!"
      }
      else if (!regexPrvoPocetno.test(this.vikendica.mesto) || !sadrziSamoSlova.test(this.vikendica.mesto)) {
        this.message = "Mesto vikendice mora pocinjati velikim slovom i sadrzati samo slova!"
      }
      else if(!proveraCena1 || !proveraCena2) {
        this.message = "Cene nocenja moraju da sadrze samo brojeve!"
      }
      else if (!proveraKontaktTelefon1) {
        this.message = "Kontakt telefon vikendice mora pocinjati sa 06 ili sa +381 i biti u odgovarajucem formatu!"
      }
      else if (!samoCifreKontaktTelefon) {
        this.message = "Kontakt telefon vikendice mora sadrzati samo cifre!"
      }
      else {
        if (!koordinataRegex) {
          this.message = "Koordinate vikendice moraju biti u formatu longituda,latituda!"
        }
        else {
          this.vikendica.vlasnik = this.ulogovan
          this.vikendicaService.dodajVikendicu(this.vikendica).subscribe(data => {
            this.message = data.poruka
            if (data.poruka == "Uspesno dodata vikendica!") this.vikendica = new Vikendica()

            this.vikendicaService.dohvatiSveMojeVikendice(this.ulogovan).subscribe(data => {
              this.sveMojeVikendice = data
            })
          })
        }
      }
    }
  }

  onFilesSelected(event: any) {
    this.vikendica.slike = Array.from(event.target.files);
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

  potvrdiRezervaciju(rezervacija: Rezervacija) {
    this.rezervacijaService.potvrdiRezervaciju(rezervacija).subscribe(data => {
      this.messageRezervacije = data.poruka
      this.rezervacijaService.dohvatiNeobradjeneRezervacijeZaMojeVikendice(this.ulogovan).subscribe(data => {
        this.neobradjeneRezervacije = data

        this.rezervacijaService.dohvatiSveRezervacijeZaMojeVikendice(this.ulogovan).subscribe(data => {
          const neobradjene = data.filter((r: any) => r.status === 'neobradjena').map((r: any) => ({
            title: `${r.vikendica?.naziv} 🏡 ${r.rezervant?.ime} ${r.rezervant?.prezime}`,
            start: r.datum_pocetka,
            end: r.datum_kraja,
            color: 'gold',
            extendedProps: { rezervacija: r }
          }));

          const potvrdjene = data.filter((r: any) => r.status === 'potvrdjena').map((r: any) => ({
            title: `${r.vikendica?.naziv} 🏡 ${r.rezervant?.ime} ${r.rezervant?.prezime}`,
            start: r.datum_pocetka,
            end: r.datum_kraja,
            color: 'green',
            extendedProps: { rezervacija: r }
          }));

          this.calendarOptions.events = [...neobradjene, ...potvrdjene];
        })

        this.izabranaRezervacija = null;
        this.prikaziDijalog = false;
      })
    })
  }

  odbijRezervaciju(rezervacija: Rezervacija) {
    if (rezervacija.komentarZaOdbijanje == "") {
      this.messageRezervacije = "Morate uneti komentar zasto odbijate rezeravciju!"
    }
    else {
      this.rezervacijaService.odbijRezervaciju(rezervacija.id, rezervacija.komentarZaOdbijanje).subscribe(data => {
        if (data.poruka == "Uspesno odbijena rezervacija!") {
          this.rezervacijaService.dohvatiNeobradjeneRezervacijeZaMojeVikendice(this.ulogovan).subscribe(data => {
            this.neobradjeneRezervacije = data

            this.rezervacijaService.dohvatiSveRezervacijeZaMojeVikendice(this.ulogovan).subscribe(data => {
              const neobradjene = data.filter((r: any) => r.status === 'neobradjena').map((r: any) => ({
                title: `${r.vikendica?.naziv} 🏡 ${r.rezervant?.ime} ${r.rezervant?.prezime}`,
                start: r.datum_pocetka,
                end: r.datum_kraja,
                color: 'gold',
                extendedProps: { rezervacija: r }
              }));

              const potvrdjene = data.filter((r: any) => r.status === 'potvrdjena').map((r: any) => ({
                title: `${r.vikendica?.naziv} 🏡 ${r.rezervant?.ime} ${r.rezervant?.prezime}`,
                start: r.datum_pocetka,
                end: r.datum_kraja,
                color: 'green',
                extendedProps: { rezervacija: r }
              }));

              this.calendarOptions.events = [...neobradjene, ...potvrdjene];
            }) 
          })
          this.izabranaRezervacija = null;
          this.prikaziDijalog = false;
          this.messageRezervacije = data.poruka
        }
      })
    }
  }

  onFilesSelectedIzmena(event: any) {
    // this.izabranaVikendicaZaIzmenu.slike = Array.from(event.target.files);
    this.newFiles = Array.from(event.target.files);
  }

  urediVikendicu(vikendica: Vikendica) {
    this.izabranaVikendicaZaIzmenu = vikendica
    this.currentVikendica = vikendica
    if (this.izmenaVikendice == false) this.izmenaVikendice = true
  }

  obrisiVikendicu(vikendica: Vikendica) {
    this.rezervacijaService.odbijRezervacijeZaVikendicu(vikendica).subscribe(data => {
      this.vikendicaService.obrisiVikendicu(vikendica.id).subscribe(data1 => {
        this.messageVikendice = data1.poruka

        this.vikendicaService.dohvatiSveMojeVikendice(this.ulogovan).subscribe(data => {
          this.sveMojeVikendice = data
        })
      })
    })
  }

  izmeniVikendicu() {
    var pocinjeVelikimSlovom = /^[A-Z].*/;
    var sadrziSamoSlova = /^[A-Z][a-zA-Z]*$/;
    if (this.izabranaVikendicaZaIzmenu.naziv == "" || this.izabranaVikendicaZaIzmenu.mesto == "" || this.izabranaVikendicaZaIzmenu.cenovnik_letnji == ""
      || this.izabranaVikendicaZaIzmenu.cenovnik_zimski == "" || this.izabranaVikendicaZaIzmenu.kontakt_telefon == "" || this.izabranaVikendicaZaIzmenu.koordinate == ""
    ) {
      this.messageVikendice = "Niste uneli sve potrebne podatke!"
    }
    else {
      if (!pocinjeVelikimSlovom.test(this.izabranaVikendicaZaIzmenu.naziv)) {
        this.messageVikendice = "Naziv vikendice mora pocinjati velikim slovom!"
      }
      else {
        if (!pocinjeVelikimSlovom.test(this.izabranaVikendicaZaIzmenu.mesto) || !sadrziSamoSlova.test(this.izabranaVikendicaZaIzmenu.mesto)) {
          this.messageVikendice = "Mesto vikendice mora pocinjati velikim slovom i sadrzati samo slova!"
        }
        else {
          var proveraCena1 = /^[0-9]+$/.test(this.izabranaVikendicaZaIzmenu.cenovnik_letnji);
          var proveraCena2 = /^[0-9]+$/.test(this.izabranaVikendicaZaIzmenu.cenovnik_zimski);
          if (!proveraCena1 || !proveraCena2) {
            this.messageVikendice = "Cene nocenja moraju da sadrze samo brojeve!"
          }
          else {
            var proveraKontaktTelefon1 = /^(06\d{7,8}|\+3816\d{7,8})$/.test(this.izabranaVikendicaZaIzmenu.kontakt_telefon);
            var samoCifre = /^\d+$/.test(this.izabranaVikendicaZaIzmenu.kontakt_telefon.replace('+',''));
            if (!proveraKontaktTelefon1) {
              this.messageVikendice = "Kontakt telefon vikendice mora pocinjati sa 06 ili sa +381 i biti u odgovarajucem formatu!"
            }
            else if (!samoCifre) {
              this.messageVikendice = "Kontakt telefon vikendice mora sadrzati samo cifre!"
            }
            else {
              var koordinataRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(this.izabranaVikendicaZaIzmenu.koordinate);
              if (!koordinataRegex) {
                this.messageVikendice = "Koordinate vikendice moraju biti u formatu longituda,latituda!"
              }
              else { 
                if (this.newFiles.length == 0) {
                  this.izabranaVikendicaZaIzmenu.slike = this.currentVikendica.slike
                }
                else {
                  this.izabranaVikendicaZaIzmenu.slike = this.newFiles
                }
                console.log(this.izabranaVikendicaZaIzmenu.slike.length)
                this.vikendicaService.izmeniVikendicu(this.izabranaVikendicaZaIzmenu).subscribe(data => {
                  if (data.poruka == "Uspesno izmenjena vikendica!") {
                    console.log(this.izabranaVikendicaZaIzmenu.slike.length)
                    this.vikendicaService.dohvatiSveMojeVikendice(this.ulogovan).subscribe(data => {
                      this.sveMojeVikendice = data
                      this.izmenaVikendice = false
                      this.messageVikendice = ""
                      this.activeSection = "vikendice"
                    })
                  }
                  else {
                    this.messageVikendice = data.poruka
                  }
                })
              }
            }
          }
        }
      }
    }
  }

  otkaziIzmenu() {
    this.izmenaVikendice = false
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

  onJsonSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);

        this.vikendica.naziv = data.naziv || "";
        this.vikendica.mesto = data.mesto || "";
        this.vikendica.usluge = data.usluge || "";
        this.vikendica.cenovnik_letnji = data.cenovnik_letnji || "";
        this.vikendica.cenovnik_zimski = data.cenovnik_zimski || "";
        this.vikendica.kontakt_telefon = data.kontakt_telefon || "";
        this.vikendica.koordinate = data.koordinate || "";

      } catch (error) {
        this.message = "Nevalidan JSON fajl.";
      }
    };
    reader.readAsText(file);
  }

  onEventClick(info: any) {
    let rezervacija = info.event.extendedProps.rezervacija;
    if (rezervacija.status === 'neobradjena') {
      this.izabranaRezervacija = rezervacija;
      this.prikaziDijalog = true;
    } else {
      this.prikaziDijalog = false;
    }
  }
}
