import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
            if (korisnik.tip == "vlasnik") {
              this.router.navigate(['vlasnik']);
            }
            else if (korisnik.tip == "turista") {
              this.router.navigate(['turista']);
            }
            else {
              this.message = ""
              this.message2 = "Slucajno ste ovde zalutali! Prijavite se preko forme za administratora!"
            }
          }
          else {
            this.message2 = ""
            this.message = korisnik.poruka
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
