import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { KorisniciServis } from '../servisi/korisnici.service';

import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss']
})


export class PrijavaComponent {


  ulogaKorisnika?: any;

  constructor(private korisniciServis : KorisniciServis, private router : Router,
     ){
  }

  async onSubmit(e : any) {

    let korime = <HTMLInputElement>document.getElementById("korime");
    let lozinka = <HTMLInputElement>document.getElementById("lozinka");

    let izrazKorime = /^[A-Za-z\d]{3,30}$/
    let izrazLozinka = /^[A-Za-z\d@$!%*#?&]{3,20}$/

    if(korime!=null && lozinka!=null){
      if(!izrazKorime.test(korime.value) || !izrazLozinka.test(lozinka.value)){
        alert("Neispravan unos!");
        e.preventDefault();
      }
      else{

       

        let korisnik = await this.korisniciServis.prijaviKorisnika(korime.value, lozinka.value);
        if(korisnik!=null){
         // this.ulogaKorisnika = korisnik.tip_korisnika_id;
          this.router.navigate(['/','pocetna']).then(() => {
            window.location.reload();
          });
        }
        else{
          alert("Ne postoji korisnik s navedenim podacima!");
        }
      }
    }
  }
}