import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { PocetnaComponent } from './pocetna/pocetna.component';


import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './profil/profil.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { SerijadetaljiComponent } from './serijadetalji/serijadetalji.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { FavoritiComponent } from './favoriti/favoriti.component';
import { FavoritdetaljiComponent } from './favoritdetalji/favoritdetalji.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { environment } from '../environments/environment';

const routes: Routes = [
  { path: 'pocetna', component: PocetnaComponent },
  { path: 'dokumentacija', component: DokumentacijaComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'korisnici', component: KorisniciComponent },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'favoriti', component: FavoritiComponent },
  { path: 'registracija', component:RegistracijaComponent },
  { path: 'serijadetalji', component: SerijadetaljiComponent },
  { path: 'favoritdetalji', component: FavoritdetaljiComponent },
  { path: '', redirectTo: '/pocetna', pathMatch: 'full' },
  
];


@NgModule({
  declarations: [AppComponent,PocetnaComponent, SerijadetaljiComponent, DokumentacijaComponent, PrijavaComponent,KorisniciComponent,FavoritiComponent,FavoritdetaljiComponent,RegistracijaComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
  
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
