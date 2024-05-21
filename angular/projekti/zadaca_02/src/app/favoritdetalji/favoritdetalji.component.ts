import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SerijeService } from '../servisi/serije.service';

@Component({
  selector: 'app-favoritdetalji',
  templateUrl: './favoritdetalji.component.html',
  styleUrls: ['./favoritdetalji.component.scss']
})
export class FavoritdetaljiComponent implements OnInit {
  podaci: any;
  id?: number;

  constructor(private ruta: ActivatedRoute, private serijeServis: SerijeService) {}

  async ngOnInit() {
    this.ruta.queryParams.subscribe(async (queryParams) => {
      this.id = queryParams['id'];
      console.log("Id serije:" + this.id);
      if (this.id != null) {
        this.podaci = await this.serijeServis.dajDetalje(this.id);
      }
    });
  }

  obrisiFavorita() {
    this.serijeServis.obrisiFavorita(this.id);
    alert("Serija je uklonjena iz favorita!");
  }
}
