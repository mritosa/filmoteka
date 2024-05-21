import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoriti',
  templateUrl: './favoriti.component.html',
  styleUrls: ['./favoriti.component.scss']
})
export class FavoritiComponent implements OnInit {

  favoriti: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.dajFavorite();
  }



  async prikaziDetalje(serija_id: any) {
    const detaljiPage = "favoritdetalji";
    const detaljiUrl = `/${detaljiPage}`;
    console.log(detaljiUrl);

    this.router.navigate([detaljiUrl], { queryParams: { id: serija_id } });
  }

  async dajFavorite() {
    let parametri = {
      method: "GET",
    };
      let odgovor = await fetch("/baza/favoriti", parametri);
      
      if (odgovor.status === 200) {
        let podaci = await odgovor.json();
        console.log(podaci);

        this.favoriti = podaci;
      }
  }
}
