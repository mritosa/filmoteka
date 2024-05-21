import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SerijeI } from '../servisi/SerijeI';
import { SerijeTmdbI, SerijaTmdbI } from '../servisi/SerijeTmdbI';

@Injectable({
  providedIn: 'root'
})
export class SerijeTMDBService {
  restServis?: string = environment.restServis;
  serijeTMDB?: SerijeTmdbI;
  serije = new Array<SerijeI>();
  page?: number;
  total_pages?: number;

  constructor() {let serije = localStorage.getItem("serije");
  console.log(serije);
  if (serije == null) {
    this.osvjeziSerije(1, "");
  } else {
    this.serijeTMDB = JSON.parse(serije) as SerijeTmdbI;
  } }
  async osvjeziSerije(stranica: number, filter: string) {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type","application/json");
    
    let parametri = {
      headers: zaglavlje
    };
  
    let odg = (await fetch(this.restServis + "tmdb/serije?stranica=" + stranica + "&trazi=" + filter,parametri)) as Response;
    if (odg.status == 200) {
      let r = JSON.parse(await odg.text()) as SerijeTmdbI;
      console.log("Pretrazivanje serija");
      console.log(r);
      this.serijeTMDB = r;
      localStorage.setItem("serije",JSON.stringify(r));
    }
  }
  async dajToken(){
    let odgovor = await fetch(this.restServis + "getJWT");
    let tekst = JSON.parse(await odgovor.text());
    if(tekst.ok != null)
      return tekst.ok;
    else 
      return "0000";
  }
  dajSerije(): Array<SerijeI> {
    if (this.serije.length == 0) {
      if (this.serijeTMDB == undefined) {
        return new Array<SerijeI>();
      } else if (this.serijeTMDB.results.length == 0) {
        return new Array<SerijeI>();
      } else {
        this.serije = new Array<SerijeI>();
        for (let serijaTMDB of this.serijeTMDB.results) {
          let serija: SerijeI = {
            naziv: serijaTMDB.name,
            opis: serijaTMDB.overview,
            id : serijaTMDB.id,
          };
          this.serije.push(serija);
        }
        this.page = this.serijeTMDB.page;
        this.total_pages = this.serijeTMDB.total_pages;
        return this.serije;
      }
    } else {
      return this.serije;
    }
  }

  async dajSerijaTMDB(idSerije: number){
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);
    
    let parametri = {
      headers: zaglavlje
    };

    let o = (await fetch(this.restServis + "tmdb/serije/" + idSerije, parametri)) as Response;
    let dohvacen = await o.text();
    let dohvacenaSerija = JSON.parse(dohvacen);

    return dohvacenaSerija;
  }
}

