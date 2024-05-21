import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KorisniciServis{
 restServis?:string =environment.restServis;
 constructor() { }

 async dodajKorisnika(ime:string,prezime:string,email:string,korime:string, lozinka:string,uloga:Number) {
  let tijelo = {
    ime: ime,
    prezime: prezime,
    email: email,
    korime: korime,
    lozinka: lozinka,
    tip_korisnika_id:uloga
  };

  let zaglavlje = new Headers();
  zaglavlje.set("Content-Type", "application/json");

  let parametri = {
    method: "POST",
    body: JSON.stringify(tijelo),
    headers: zaglavlje,
  };
  let odgovor = (await fetch(
    this.restServis +"korisnici",
    parametri
  )) as Response;

  if (odgovor.status == 200) {
    console.log("Korisnik ubačen na servisu");
    return true;
  } else {
    console.log(odgovor.status);
    console.log(await odgovor.text());
    return false;
  }
}


 async prijaviKorisnika(korime:string, lozinka:string) {
  //lozinka = kodovi.kreirajSHA256(lozinka, "moja sol");
  let tijelo = {
    korime: korime,
    lozinka: lozinka,
  };
  console.log(lozinka);
  let zaglavlje = new Headers();
  zaglavlje.set("Content-Type", "application/json");

  let parametri = {
    method: "POST",
    body: JSON.stringify(tijelo),
    headers: zaglavlje,
  };
  let odgovor = (await fetch(
    "http://localhost:12000/prijava",
    parametri
  )) as Response;

  if (odgovor.status == 201) {
    return await odgovor.text();
  } else {
    return false;
  }
}

async azurirajKorisnika(ime:string,prezime:string,email:string,korime:string, lozinka:string) {
  let zaglavlje = new Headers();
  zaglavlje.set("Content-Type", "application/json");

  let tijelo = {
    ime : ime,
    prezime : prezime,
    lozinka : lozinka,
    korime : korime
  }

  let parametri = {
    method: "PUT",
    body: JSON.stringify(tijelo),
    headers: zaglavlje,
  };

  let odgovor = (await fetch(
    this.restServis +"korisnici/" + korime,
    parametri
  ))as Response;
  if (odgovor.status == 201) {
    return odgovor.text();
  } else return false;
}

async obrisiKorisnika(korime:String) {
  let zaglavlje = new Headers();
  zaglavlje.set("Content-Type", "application/json");


  let parametri = {
    method: "DELETE",
    headers: zaglavlje,
  };

  let odgovor = (await fetch(
    this.restServis +"korisnici/" + korime,
    parametri
  ))as Response;
  if (odgovor.status == 201) {
    return odgovor.text();
  } else return false;
}
async dajKorisnika(korime:string) {
  let zaglavlje = new Headers();
  zaglavlje.set("Content-Type", "application/json");
  let odgovor = (await fetch(
    this.restServis +"korisnici/" + korime
  )) as Response;
  if (odgovor.status == 200) {
    let podaci = await odgovor.text();
    let korisnik = JSON.parse(podaci);
    return korisnik;
  } else {
    return null;
  }
}


}
