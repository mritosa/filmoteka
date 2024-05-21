import { Component ,ViewChild,OnInit} from '@angular/core';
import { KorisniciServis } from './servisi/korisnici.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  ulogaKorisnika?: any;

constructor(private korisniciServis: KorisniciServis){}
 
  ngOnInit(){
    this.prikaziPodatkeProfila();
  }  

  ngAfterViewInit(){
    this.prikaziPodatkeProfila();
  }
  putanja = 'pocetna';
  prebaciNa(putanja: string) {
    this.putanja = putanja;
  }

  async odjava(){
    let o = (await fetch("http://localhost:12000/odjava")) as Response;
    if(o.status==200){
      alert("Odjavljeni ste!");
      this.prikaziPodatkeProfila();
    }
    else{
      alert("Greška prilikom odjave!");
    }
  }

  async  prikaziPodatkeProfila() {
    let parametri = {
      method: "GET",
    };
   
    let odgovor = (await fetch("/profilDetalji", parametri)) as Response;
    if (odgovor.status == 200) {
      let podaci = await odgovor.text();
      var korisnik = JSON.parse(podaci);
    //  korisnik = korisnik;
      this.ulogaKorisnika = korisnik.tip_korisnika_id;
      console.log(this.ulogaKorisnika);
    }
  }
  
}