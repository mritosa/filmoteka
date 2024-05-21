import { Component, OnInit } from '@angular/core';
import { KorisniciServis } from '../servisi/korisnici.service';
import { SerijeService } from '../servisi/serije.service';

interface Korisnik {
  id: number;
  ime: string;
  prezime: string;
  lozinka: string;
  email: string;
  korime: string;
}

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.component.html',
  styleUrls: ['./korisnici.component.scss']
})
export class KorisniciComponent implements OnInit {
  korisnici: Korisnik[] = [];

  constructor(private korisniciServis: KorisniciServis, private serijeServis: SerijeService) {}

  ngOnInit() {
    this.dajKorisnike();
  }

  async dajKorisnike() {
      let odgovor = await fetch("baza/korisnici");
      if (odgovor.status === 200) {
        let podaci = await odgovor.json();
        console.log(podaci);
        this.korisnici = podaci;
      }
  }

 async obrisiKorisnika(korime: string) {
let korisnik =	await this.korisniciServis.dajKorisnika(korime);
if (korisnik.tip_korisnika_id === 2) {
	await this.serijeServis.obrisiFavorite(korisnik.id);
	await this.korisniciServis.obrisiKorisnika(korime);
	await this.dajKorisnike();
} else {
	console.log("Nije moguće obrisati Admina");
}
  }
}
