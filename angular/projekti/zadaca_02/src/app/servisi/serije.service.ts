import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SerijeBaza } from './SerijeBaza';

@Injectable({
  providedIn: 'root'
})
export class SerijeService {
  restServis?: string = environment.restServis;
  serijeBa?: SerijeBaza;
  serije = new Array<SerijeBaza>();
  serija? : SerijeBaza;
  podaci:any;

  constructor() {
    
   }
   async  dajDetalje(id:Number) {
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);
    
    let parametri = {
      headers: zaglavlje
    };

    let o = (await fetch(this.restServis + "favoriti/" + id, parametri)) as Response;
    let dohvacen = await o.text();
    let dohvacenaSerija = JSON.parse(dohvacen);

    return dohvacenaSerija;
  }
  async  obrisiFavorita(id:any) {
    let tjelo = {
      tmdb_id: id,
    };
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);
    let parametri = {
      method: "DELETE",
      body: JSON.stringify(tjelo),
      headers: zaglavlje,
    };

    let o = (await fetch(this.restServis + "favoriti/" + id, parametri)) as Response;
   if(o.status == 201){
     return "Favorit obrisan";
   }
   else{return "Favorit nije obrisan"}
  }

  async  obrisiFavorite(id:any) {
    let tjelo = {
      tmdb_id: id,
    };
    let zaglavlje = new Headers();
    let token = await this.dajToken();
	  zaglavlje.set("Content-Type","application/json");
	  zaglavlje.append("Authorization",token);
    let parametri = {
      method: "DELETE",
      body: JSON.stringify(tjelo),
      headers: zaglavlje,
    };

    let o = (await fetch(this.restServis + "obrisiSveFavorite/" + id, parametri)) as Response;
   if(o.status == 201){
     return "Favorit obrisani";
   }
   else{return "Favorit nije obrisan"}
  }

   async dajToken(){
    let odgovor = await fetch(this.restServis + "getJWT");
    let tekst = JSON.parse(await odgovor.text());
    if(tekst.ok != null)
      return tekst.ok;
    else 
      return "0000";
  }
}
