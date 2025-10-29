import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-administrator',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login-administrator.component.html',
  styleUrl: './login-administrator.component.css'
})
export class LoginAdministratorComponent {
  private router = inject(Router)
  private korisnikService = inject(KorisnikService)

  username = ""
  password = ""
  message = ""
  message2 = ""

  login() {
    if (this.username != "" && this.password != "") {
      this.korisnikService.login(this.username, this.password).subscribe(korisnik => {
        if (korisnik != null) {
          if ('tip' in korisnik) {
            this.message = "";
            this.message2 = "";
            localStorage.setItem('ulogovan', JSON.stringify(korisnik));
            if (korisnik.tip == "administrator") {
              this.router.navigate(['administrator']);
            }
            else {
              this.message = ""
              this.message2 = "Slucajno ste ovde zalutali! Prijavite se preko forme za vlasnike i turiste!"
            }
          }
          else {
            this.message = korisnik.poruka
            this.message2 = ""
          }
        }
        else {
          this.message2 = "";
          this.message = "Korisnik sa ovim kredencijalima ne postoji!"
        }
      })
    }
    else {
      this.message2 = "";
      this.message = "Niste uneli sve potrebne podatke za prijavljivanje!"
    }
  }
}
