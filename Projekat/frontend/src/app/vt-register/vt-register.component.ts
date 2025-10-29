import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Korisnik } from '../models/korisnik';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-vt-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './vt-register.component.html',
  styleUrl: './vt-register.component.css'
})
export class VtRegisterComponent {
  private korisnikService = inject(KorisnikService)

  korisnik: Korisnik = new Korisnik()
  message = ""
  putanjaSlike = ""

  register() {
    if (this.korisnik.korisnicko_ime != "" && this.korisnik.lozinka != "" && this.korisnik.tip != "" && this.korisnik.ime != "" &&
      this.korisnik.prezime != "" && this.korisnik.pol != "" && this.korisnik.adresa != "" && this.korisnik.kontakt_telefon != "" &&
      this.korisnik.mejl != "" && this.korisnik.broj_kreditne_kartice != ""
    ) {
      this.message = ""
      var korisnickoImeRegex = /^[a-z0-9_.]{3,}$/;
      if (!korisnickoImeRegex.test(this.korisnik.korisnicko_ime)) {
        this.message = "Korisnicko ime nije u odgovarajucem formatu: mora imati najmanje 3 karaktera i moze sadrzati samo mala slova, brojeve, donju crtu (_) i tacku(.)!"
      }
      else {
        if (this.korisnik.lozinka.length < 6 || this.korisnik.lozinka.length > 10) {
        this.message = "Duzina lozinke mora biti izmedju 6 i 10 karaktera!"
        }
        else {
          var sadrziVelikoSlovo = /[A-Z]/.test(this.korisnik.lozinka);
          if (!sadrziVelikoSlovo) {
            this.message = "Lozinka mora da sadrzi barem jedno veliko slovo!"
          }
          else {
            var malaSlova = this.korisnik.lozinka.match(/[a-z]/g) || [];
            var sadrziTriMalaSlova = malaSlova.length >= 3;
            if (!sadrziTriMalaSlova) {
              this.message = "Lozinka mora da sadrzi barem tri mala slova!"
            }
            else {
              var sadrziBroj = /\d/.test(this.korisnik.lozinka);
              if (!sadrziBroj) {
                this.message = "Lozinka mora da sadrzi barem jedan broj!"
              }
              else {
                var sadrziSpecijalneKaraktere = /[!@#$%^&*_.]/.test(this.korisnik.lozinka);
                if (!sadrziSpecijalneKaraktere) {
                  this.message = "Lozinka mora da sadrzi barem jedan od sledecih specijalnih karaktera: !, ., @, #, $, %, ^, _ !"
                }
                else {
                  var pocinjeSaSlovom = /^[A-Za-z]/.test(this.korisnik.lozinka);
                  if (!pocinjeSaSlovom) {
                    this.message = "Lozinka mora pocinjati slovom!"
                  }
                  else {
                    var pocinjeVelikimSlovom = /^[A-Z][a-zA-Z]*$/;
                    if (!pocinjeVelikimSlovom.test(this.korisnik.ime)) {
                      this.message = "Ime korisnika mora pocinjati velikim slovom i sadrzati samo slova!"
                    }
                    else {
                      if (!pocinjeVelikimSlovom.test(this.korisnik.prezime)) {
                        this.message = "Prezime korisnika mora pocinjati velikim slovom i sadrzati samo slova!"
                      }
                      else {
                        var proveraAdresa = /^[A-Z][a-zA-Z\s]*,\s[A-Z][a-zA-Z\s]*\s\d+$/.test(this.korisnik.adresa);
                        if (!proveraAdresa) {
                          this.message = "Adresa korisnika mora biti uneta u sledecem formatu: Grad, Ulica Broj (npr. Beograd, Kneza Milosa 10)!"
                        }
                        else {
                          var proveraKontaktTelefon1 = /^(06\d{7,8}|\+3816\d{7,8})$/.test(this.korisnik.kontakt_telefon);
                          var samoCifre = /^\d+$/.test(this.korisnik.kontakt_telefon.replace('+',''));
                          if (!proveraKontaktTelefon1) {
                            this.message = "Kontakt telefon korisnika mora pocinjati sa 06 ili sa +381 i biti u odgovarajucem formatu!"
                          }
                          else if (!samoCifre) {
                            this.message = "Kontakt telefon korisnika mora sadrzati samo cifre!"
                          }
                          else {
                            var proveraEMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.korisnik.mejl);
                            if (!proveraEMail) {
                              this.message = "Email korisnika mora biti u odgovarajucem formatu! (npr. korisnik@domen.rs)"
                            }
                            else {
                              var diners12Regex = /^(300|301|302|303)\d{12}$/;
                              var diners13Regex = /^(36|38)\d{13}$/;
                              var mastercardRegex = /^(5[1-5])\d{14}$/;
                              var visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;
                              if (!diners12Regex.test(this.korisnik.broj_kreditne_kartice) && !diners13Regex.test(this.korisnik.broj_kreditne_kartice) &&
                                !mastercardRegex.test(this.korisnik.broj_kreditne_kartice) && !visaRegex.test(this.korisnik.broj_kreditne_kartice)) {
                                  this.message = "Broj kartice nije validan!"
                                }
                              else {
                                this.korisnikService.proveriKorisnickoIme(this.korisnik.korisnicko_ime).subscribe(data => {
                                  if (data.poruka == "Vec postoji!") {
                                    this.message = "Korisnik sa ovim korisnickim imenom vec postoji!"
                                  }
                                  else {
                                    this.korisnikService.proveriEmailAdresu(this.korisnik.mejl).subscribe(data => {
                                      if (data.poruka == "Vec postoji!") {
                                        this.message = "Korisnik sa ovom email adresom vec postoji!"
                                      }
                                      else {
                                        this.korisnikService.register(this.korisnik).subscribe({
                                          next: (data) => {
                                            this.message = data.poruka;
                                            this.korisnik = new Korisnik()
                                          },
                                          error: (err: any) => {
                                            this.message = "Doslo je do greske prilikom registracije!";
                                          }
                                        }); 
                                      }
                                    })
                                  }
                                })
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    else {
      this.message = "Niste uneli sve podatke u formu!"
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.message = "Dozvoljeni su samo JPG i PNG formati za profilnu sliku korisnika!"
      event.target.value = ""; 
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
        this.message = "Slika mora biti između 100x100px i 300x300px!"
        event.target.value = ""; 
        return;
      }
    }

    this.korisnik.profilna_slika = file;

    img.src = URL.createObjectURL(file);
    this.message = ""
  }
}