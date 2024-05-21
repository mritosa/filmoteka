import { ApplicationRef, Component} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SerijeTMDBService } from '../servisi/serije-tmdb.service';
import { SerijeI } from '../servisi/SerijeI';
import {KorisniciServis} from '../servisi/korisnici.service'

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.scss']
})

export class PocetnaComponent {
  serije = new Array<SerijeI>();
 

  page? : number;
  total_pages? : number;
  constructor(private serijeTMDBServis:SerijeTMDBService, private router: Router, 
     private appRef : ApplicationRef, private korisniciServis: KorisniciServis){

  }
  async ngOnInit() {
    if (this.serije.length == 0) {
      setTimeout(this.dohvatiSerije.bind(this), 3000);
    }
  }

   trackByFn(index : number, object:any){
    return object.id;
  }

  prikaziDetalje(serija_id: any) {
    const detaljiPage = "serijadetalji";
    const detaljiUrl = `/${detaljiPage}`;
    console.log(detaljiUrl);


    this.router.navigate([detaljiUrl], { queryParams: { id: serija_id } });
  }

  pretraziSerije(event: KeyboardEvent): void {
    const unos = (event.target as HTMLInputElement).value;

    
    if (unos.length >= 3) {
      this.dohvatiSerijeStranicenje(1);
    }
  }

  async dohvatiSerijeStranicenje(str : number){
    this.serije = [];
    await this.serijeTMDBServis.osvjeziSerije(str,this.dajTrazeno());
    this.dohvatiSerije();
  }
  dohvatiSerije() {
    this.serijeTMDBServis.serije = [];
    this.serije = this.serijeTMDBServis.dajSerije();
    if(this.serije.length != 0){
      this.dohvatiPodatkeZaStranicenje();
    }
  }

  dohvatiPodatkeZaStranicenje(){
   this.page = this.serijeTMDBServis.page;
  this.total_pages = this.serijeTMDBServis.total_pages;

  }
 

  prikaziStranicenje(str : string,ukupno : number){
    let prikaz = <HTMLDivElement>document.getElementById("stranicenje");
    let html="";
    let stranica=parseInt(str);
    if(stranica>1){
      html="<button onclick=\"dohvatiSerijeStranicenje(1)\"'><<<</button>";
      html+="<button onclick=\"dohvatiSerijeStranicenje(" + (stranica-1) + ")\"><</button>";
    }
    html+="<button onclick=\"dohvatiSerijeStranicenje(" + (stranica) + ")\">" + str + "/" + ukupno + "</button>";
    if(stranica<ukupno){
      html+="<button onclick=\"dohvatiSerijeStranicenje(" + (stranica+1) + ")\">></button>";
      html+="<button onclick=\"dohvatiSerijeStranicenje(" + (ukupno) + ")\">>>></button>";
    }
    prikaz.innerHTML=html;
  }

   dajTrazeno() {
    let serija = <HTMLInputElement>document.getElementById("trazilica");
   console.log(serija);
    return serija.value;
}
}


