import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KorisniciServis } from '../servisi/korisnici.service';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss'
})
export class RegistracijaComponent {

constructor(private korisniciServis:KorisniciServis,private router : Router){}
async onSubmit(e: any) {
  let ime = <HTMLInputElement>document.getElementById("ime");
  let prezime = <HTMLInputElement>document.getElementById("prezime");
  let korime = <HTMLInputElement>document.getElementById("korime");
  let lozinka = <HTMLInputElement>document.getElementById("lozinka");
  let email = <HTMLInputElement>document.getElementById("email");

  let provjeraIme = /^[A-Za-z\s]{1,}$/;
	let provjeraPrezime = /^[A-Za-z\s]{1,}$/;
	let provjeraKorime = /^[a-zA-Z0-9_]{2,}$/;
	let provjeraLozinka = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
	let provjeraEmail = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+.[a-z]{2,}$/;

  if (!provjeraIme.test(ime.value)) {
		alert("Neispravno uneseno polje 'Ime:'!");
		e.preventDefault();
	} else if (!provjeraPrezime.test(prezime.value)) {
		alert("Neispravno uneseno polje 'Prezime:'!");
		e.preventDefault();
	} else if (!provjeraLozinka.test(lozinka.value)) {
		alert("Neispravno uneseno polje 'Lozinka:'!");
		e.preventDefault();
	} else if (!provjeraEmail.test(email.value)) {
		alert("Neispravno uneseno polje 'E-mail:'!");
		e.preventDefault();
	} else if (!provjeraKorime.test(korime.value)) {
		alert("Neispravno uneseno polje 'Korime:'!");
		e.preventDefault();
	}
  else{
    
    let registriran = await this.korisniciServis.dodajKorisnika(ime.value, prezime.value,email.value, korime.value, lozinka.value,2);
    if(registriran){
      this.router.navigate(['/','prijava']);
    }
    
  }
}
}
