import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SerijeTMDBService } from '../servisi/serije-tmdb.service';

@Component({
  selector: 'app-serijadetalji',
  templateUrl: './serijadetalji.component.html',
  styleUrl: './serijadetalji.component.scss'
})
export class SerijadetaljiComponent {
   
   podaci:any;
constructor( private ruta:ActivatedRoute, private serijaTMDB:SerijeTMDBService){}

   async ngOnInit(){
   
    this.ruta.queryParams.subscribe(async queryParams => {
      const id = queryParams['id'];
      console.log("Id serije:" + id);
      if(id!=null){
        this.podaci = await this.serijaTMDB.dajSerijaTMDB(id);
        prikaziDetaljeSerije(this.podaci);
      }
    });
  }

  async dodajFavorita(){
    let tijelo = {
      naziv: this.podaci.name,
      opis: this.podaci.overview,
      broj_sezona: this.podaci.number_of_seasons,
      broj_epizoda: this.podaci.number_of_episodes,
      slika: this.podaci.poster_path,
      popularnost: this.podaci.popularity,
      tmdb_id: this.podaci.id,
      sezone: this.podaci.seasons,
    };
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
  
    let parametri = {
      method: "POST",
      body: JSON.stringify(tijelo),
      headers: zaglavlje,
    };
    let odgovor = await fetch("baza/favoriti/", parametri);
    if (odgovor.status == 201) {
      console.log("Favorit uspješno dodan!");
    } else if (odgovor.status == 401) {
      console.log("Neautorizirani pristup! Prijavite se!");
    } else if (odgovor.status == 409) {
      alert("Ova serija se već nalazi u favoritima!");
    }
  }



}
function prikaziDetaljeSerije(s: any) {
  let glavna = <HTMLDivElement>document.getElementById("detaljiSerije");
  let prikaz = "<div>";
	prikaz += "<h1>" + s.name + "</h1>";
	prikaz +=
		"<img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
		s.poster_path +
		"' width='200' alt='slika'/><br>";
	prikaz += "<p>" + s.overview + "</p>";
	prikaz += "<p>Broj epizoda:" + s.number_of_episodes + "</p>";

	prikaz += "<p>Broj sezona:" + s.number_of_seasons + "</p>";

	prikaz += "<p>Popularnost" + s.popularity + "</p>";
	prikaz +=
		"Link za vanjsku stranicu:<a href=" +
		s.homepage +
		">" +
		s.homepage +
		"</a>";
	prikaz += "</div>";

	glavna.innerHTML = prikaz;
}

