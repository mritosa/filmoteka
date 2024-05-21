import express from "express";
import sesija from "express-session";
import kolacici from "cookie-parser";
import Konfiguracija from "./konfiguracija.js";
//import portovi from "/var/www/RWA/2023/portovi.js";
import restKorisnik from "./aplikacija/servis/restKorisnik.js";
import restFavoriti from "./aplikacija/servis/restFavoriti.js";
import restDnevnik from "./aplikacija/servis/restDnevnik.js";
import HtmlUpravitelj from "./aplikacija/htmlUpravitelj.js";
import FetchUpravitelj from "./aplikacija/fetchUpravitelj.js";
import RestKorisnik from "./aplikacija/servis/restKorisnik.js";
//const port = portovi.mritosa20;
const port = 12000;
const server = express();
import cors from "cors";


let konf = new Konfiguracija();
konf
	.ucitajKonfiguraciju()
	.then(pokreniServer)
	.catch((greska) => {
		console.log(greska);
		if (process.argv.length == 2) {
			console.error("Niste naveli naziv konfiguracijske datoteke!");
		} else {
			console.error("Datoteka ne postoji: " + greska.path);
		}
	});

function pokreniServer() {
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());
	server.use(cors());
	server.use(kolacici());
	server.use(
		sesija({
			secret: konf.dajKonf().tajniKljucSesija,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 3 },
			resave: false,
		})
	);


	server.use("/",express.static("./angular"));
	server.get(/^(?!\/(getJWT|dajUlogiranog|odjava|baza|profilDetalji)).*$/, (req, res) => {
		res.sendFile('index.html', { root: "./angular" });
	});

	pripremiPutanjeKorisnik();
	pripremiPutanjeFavoriti();
	pripremiPutanjeTMDB();
	pripremiPutanjeNavigacija();
	pripremiPutanjeDnevnik();
	pripremiPutanjeAutentifikacija();


	server.use((zahtjev, odgovor) => {
		odgovor.status(404);
		odgovor.json({ opis: "nema resursa" });
	});
	server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});
}

function pripremiPutanjeKorisnik() {
	let restKorisnik = new RestKorisnik(konf.dajKonf().jwtTajniKljuc);
	server.get("/baza/korisnici", restKorisnik.getKorisnici.bind(restKorisnik));
	server.post("/baza/korisnici", restKorisnik.postKorisnici.bind(restKorisnik));
	server.delete(
		"/baza/korisnici",
		restKorisnik.deleteKorisnici.bind(restKorisnik)
	);
	server.put("/baza/korisnici", restKorisnik.putKorisnici.bind(restKorisnik));

	server.get(
		"/baza/korisnici/:korime",
		restKorisnik.getKorisnik.bind(restKorisnik)
	);
	server.post(
		"/baza/korisnici/:korime",
		restKorisnik.postKorisnik.bind(restKorisnik)
	);
	server.delete(
		"/baza/korisnici/:korime",
		restKorisnik.deleteKorisnik.bind(restKorisnik)
	);
	server.put(
		"/baza/korisnici/:korime",
		restKorisnik.putKorisnik.bind(restKorisnik)
	);
	server.get(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.getKorisnikPrijava.bind(restKorisnik)
	);
	server.post(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.postKorisnikPrijava.bind(restKorisnik)
	);
	server.put(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.putKorisnikPrijava.bind(restKorisnik)
	);
	server.delete(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.deleteKorisnikPrijava.bind(restKorisnik)
	);
}

function pripremiPutanjeFavoriti() {
	server.get("/baza/favoriti", restFavoriti.getFavoriti);
	server.post("/baza/favoriti", restFavoriti.postFavoriti);
	server.delete("/baza/favoriti", restFavoriti.deleteFavoriti);
	server.put("/baza/favoriti", restFavoriti.putFavoriti);

	server.get("/baza/favoriti/:id", restFavoriti.getFavoritId);
	server.post("/baza/favoriti/:id", restFavoriti.postFavoritId);
	server.delete("/baza/favoriti/:id", restFavoriti.deleteFavoritId);
	server.put("/baza/favoriti/:id", restFavoriti.putFavoritId);

	server.delete("/baza/obrisiSveFavorite/:id", restFavoriti.deleteSviFavoriti);
}

function pripremiPutanjeDnevnik() {
	server.get("/baza/dnevnik", restDnevnik.getDnevnik);
	server.post("/baza/dnevnik", restDnevnik.postDnevnik);
	server.delete("/baza/dnevnik", restDnevnik.deleteDnevnik);
	server.put("/baza/dnevnik", restDnevnik.putDnevnik);
}

function pripremiPutanjeTMDB() {
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf()["tmdb.apikey.v3"]);
	server.get(
		"/baza/tmdb/serije",
		fetchUpravitelj.serijePretrazivanje.bind(fetchUpravitelj)
	);
	server.get(
		"/baza/tmdb/serije/:id",
		fetchUpravitelj.serijaDetalji.bind(fetchUpravitelj)
	);
}

function pripremiPutanjeNavigacija() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(
		konf.dajKonf()["tmdb.apikey.v3"],
		konf.dajKonf().jwtTajniKljuc
	);
	server.get("/", htmlUpravitelj.pocetna.bind(htmlUpravitelj));
	server.get(
		"/favoritdetalji?:id",
		htmlUpravitelj.favoritdetalji.bind(htmlUpravitelj)
	);
	server.get(
		"/baza/favoriti/:id",
		fetchUpravitelj.dodajFavorita.bind(fetchUpravitelj)
	);

	server.get(
		"/dokumentacija",
		htmlUpravitelj.dokumentacija.bind(htmlUpravitelj)
	);
	server.get("/dnevnik", htmlUpravitelj.dnevnik.bind(htmlUpravitelj));

	server.get("/korisnici", htmlUpravitelj.korisnici.bind(htmlUpravitelj));
	server.get("/favoriti", htmlUpravitelj.favoriti.bind(htmlUpravitelj));
}

function pripremiPutanjeAutentifikacija() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	let fetchUpravitelj = new FetchUpravitelj(
		konf.dajKonf()["tmdb.apikey.v3"],
		konf.dajKonf().jwtTajniKljuc
	);
	server.get("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
	server.post(
		"/registracija",
		htmlUpravitelj.registracija.bind(htmlUpravitelj)
	);
	server.get("/odjava", htmlUpravitelj.odjava.bind(htmlUpravitelj));
	server.put("/profil", htmlUpravitelj.profil.bind(htmlUpravitelj));
	server.get(
		"/profilDetalji",
		fetchUpravitelj.prikaziProfil.bind(fetchUpravitelj)
	);
	server.get(
		"/baza/favoriti",
		fetchUpravitelj.dodajFavorita.bind(fetchUpravitelj)
	);
	server.post("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
	server.get("/getJWT", fetchUpravitelj.getJWT.bind(fetchUpravitelj));
}
