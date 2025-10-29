import { Component, inject } from '@angular/core';
import { Korisnik } from '../models/korisnik';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  ulogovan: Korisnik = new Korisnik()
  private korisnikService = inject(KorisnikService)
  private router = inject(Router)

  oldPassword = ""
  newPassword = ""
  againNewPassword = ""
  message = ""

  ngOnInit() {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) this.ulogovan = JSON.parse(korisnik);
  }

  changePassword() {
    if (this.oldPassword == "" || this.newPassword == "" || this.againNewPassword == "") {
      this.message = "Niste popunili sva polja forme!"
    }
    else {
      if (this.newPassword != this.againNewPassword) {
        this.message = "Nove lozinke se ne poklapaju — unesite istu lozinku još jednom!"
      }
      else {
        if (this.oldPassword == this.newPassword) {
          this.message = "Stara i nova lozinka ne smeju biti iste!"
        }
        else {
          this.korisnikService.proveriLozinku(this.ulogovan.korisnicko_ime, this.oldPassword).subscribe(data => {
            console.log(data.poruka)
            if (data.poruka == "Lozinke se poklapaju!") {
              if (this.newPassword.length < 6 || this.newPassword.length > 10) {
                this.message = "Duzina lozinke mora biti izmedju 6 i 10 karaktera!"
              }
              else {
                var sadrziVelikoSlovo = /[A-Z]/.test(this.newPassword);
                if (!sadrziVelikoSlovo) {
                  this.message = "Lozinka mora da sadrzi barem jedno veliko slovo!"
                }
                else {
                  var malaSlova = this.newPassword.match(/[a-z]/g) || [];
                  var sadrziTriMalaSlova = malaSlova.length >= 3;
                  if (!sadrziTriMalaSlova) {
                    this.message = "Lozinka mora da sadrzi barem tri mala slova!"
                  }
                  else {
                    var sadrziBroj = /\d/.test(this.newPassword);
                    if (!sadrziBroj) {
                      this.message = "Lozinka mora da sadrzi barem jedan broj!"
                    }
                    else {
                      var sadrziSpecijalneKaraktere = /[!@#$%^&*_.]/.test(this.newPassword);
                      if (!sadrziSpecijalneKaraktere) {
                        this.message = "Lozinka mora da sadrzi barem jedan od sledecih specijalnih karaktera: !, ., @, #, $, %, ^, _ !"
                      }
                      else {
                        var pocinjeSaSlovom = /^[A-Za-z]/.test(this.newPassword);
                        if (!pocinjeSaSlovom) {
                          this.message = "Lozinka mora pocinjati slovom!"
                        }
                        else {
                          this.korisnikService.promeniLozinkuKorisniku(this.ulogovan.korisnicko_ime, this.newPassword).subscribe(data1 => {
                            if (data1.poruka == "Uspesna promena lozinke!") {
                              this.message = data1.poruka
                              if (this.ulogovan.tip != 'administrator') {
                                this.router.navigate(['login'])
                              }
                              else {
                                this.router.navigate(['loginAdministrator'])
                              }
                            }
                            else {
                              this.message = data1.poruka
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
              this.message = data.poruka
            }
          })
        }
      }
    }
  }
}
