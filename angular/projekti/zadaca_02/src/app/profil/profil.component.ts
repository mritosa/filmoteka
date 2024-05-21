import { Component, ElementRef, OnInit} from '@angular/core';
import { KorisniciServis } from '../servisi/korisnici.service';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit {
  constructor(private elementRef: ElementRef,private korisniciServis: KorisniciServis) {}
  
  ime = <HTMLInputElement>document.getElementById("ime");
  prezime = <HTMLInputElement>document.getElementById("prezime");
  korime = <HTMLInputElement>document.getElementById("korime");
  lozinka = <HTMLInputElement>document.getElementById("lozinka");
  email = <HTMLInputElement>document.getElementById("email");
  sadrzaj = this.elementRef.nativeElement.querySelector('#sadrzaj');
 

  async ngOnInit() {
    this.ime = <HTMLInputElement>document.getElementById("ime");
    this.prezime = <HTMLInputElement>document.getElementById("prezime");
    this.korime = <HTMLInputElement>document.getElementById("korime");
    this.lozinka = <HTMLInputElement>document.getElementById("lozinka");
    this.email = <HTMLInputElement>document.getElementById("email");

    this.prikaziPodatkeProfila();
  }
  async  prikaziPodatkeProfila() {
    let parametri = {
      method: "GET",
    };
   
    let odgovor = (await fetch("/profilDetalji", parametri)) as Response;
    if (odgovor.status == 200) {
      let podaci = await odgovor.text();
      
      podaci = JSON.parse(podaci);
      console.log(podaci);
      this.prikaziKorisnika(podaci);
    } else   {
      this.sadrzaj= "";
    }
   
  }


  async prikaziKorisnika(korisnik : any){
    
    this.ime.value=korisnik.ime;
    this.prezime.value = korisnik.prezime;
    this.email.value = korisnik.email;
    this.korime.value = korisnik.korime;
  
    this.email.disabled = true;
    this.korime.disabled = true;    
  }

  async  btnAzuriraj(e:any) {
    if (this.ime.value == "" || this.prezime.value == "") {
      alert("Ime ili prezime nesmijete ostaviti prazno!");
    } else {
      this.korisniciServis.azurirajKorisnika(this.ime.value, this.prezime.value,this.email.value, this.korime.value, this.lozinka.value );
      alert("Profil uspješno ažuriran!");
    }
  }

}
