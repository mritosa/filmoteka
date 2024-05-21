const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js");
const totp = require("./moduli/totp.js");
const Autentifikacija = require("./autentifikacija.js");
const Favoriti = require("./favoriti.js");
const Profil = require("./profil.js");

class HtmlUpravitelj {
	constructor(tajniKljucJWT) {
		this.tajniKljucJWT = tajniKljucJWT;
		console.log(this.tajniKljucJWT);
		this.auth = new Autentifikacija();
		this.fav = new Favoriti();
		this.profi = new Profil();
	}

	pocetna = async function (zahtjev, odgovor) {
		let pocetna = await ucitajStranicu("pocetna", zahtjev.session.uloga);
		odgovor.send(pocetna);
	};
	dokumentacija = async function (zahtjev, odgovor) {
		let dokumentacija = await ucitajStranicu(
			"dokumentacija",
			zahtjev.session.uloga
		);
		odgovor.send(dokumentacija);
	};
	korisnici = async function (zahtjev, odgovor) {
		let korisnici = await ucitajStranicu("korisnici", zahtjev.session.uloga);
		odgovor.send(korisnici);
	};

	registracija = async function (zahtjev, odgovor) {
		console.log(zahtjev.body);
		let greska = "";
		if (zahtjev.method == "POST") {
			let uspjeh = await this.auth.dodajKorisnika(
				zahtjev.body,
				zahtjev.session.uloga
			);
			if (uspjeh) {
				odgovor.redirect("/prijava");
				return;
			} else {
				greska = "Dodavanje nije uspjelo provjerite podatke!";
			}
		}

		let stranica = await ucitajStranicu("registracija", 1);
		odgovor.send(stranica);
	};

	profil = async function (zahtjev, odgovor) {
		let greska = "";
		if (zahtjev.method == "PUT") {
			let uspjeh = await this.profi.azurirajKorisnika(zahtjev.body);
			if (uspjeh) {
				odgovor.status(201);
				odgovor.send(uspjeh);
			} else {
				greska = "Ažuriranje nije uspjelo!";
			}
		}
	};

	odjava = async function (zahtjev, odgovor) {
		zahtjev.session.uloga = null;
		zahtjev.session.korisnik_id = null;
		zahtjev.session.korime = null;
		zahtjev.session.jwt = null;
		zahtjev.session.korisnik = null;
		console.log(zahtjev.session.uloga);
		odgovor.redirect("/");
	};
	favoriti = async function (zahtjev, odgovor) {
		let favoriti = await ucitajStranicu("favoriti", zahtjev.session.uloga);
		odgovor.send(favoriti);
	};
	dnevnik = async function (zahtjev, odgovor) {
		let dnevnik = await ucitajStranicu("dnevnik", zahtjev.session.uloga);
		odgovor.send(dnevnik);
	};
	//detalji = async function (zahtjev, odgovor) {
	//	let greska = "";
//
//		let detalji = await ucitajStranicu("serijadetalji", zahtjev.session.uloga);
//		odgovor.send(detalji);
//	};
	favoritdetalji = async function (zahtjev, odgovor) {
		let detalji = await ucitajStranicu("favoritdetalji", zahtjev.session.uloga);
		odgovor.send(detalji);
	};

	prijava = async function (zahtjev, odgovor) {
		let greska = "";
		if (zahtjev.method == "POST") {
			var korime = zahtjev.body.korime;
			var lozinka = zahtjev.body.lozinka;
			var korisnik = await this.auth.prijaviKorisnika(korime, lozinka);
			console.log(korisnik);
			console.log(korime + lozinka);
			if (korisnik) {
				zahtjev.session.jwt = jwt.kreirajToken(korisnik, this.tajniKljucJWT);
				korisnik = JSON.parse(korisnik);
				zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
				zahtjev.session.korisnik_id = korisnik.id;
				zahtjev.session.uloga = korisnik.tip_korisnika_id;
				zahtjev.session.korime = korime;
				console.log(zahtjev.session);
				odgovor.status(201);
				odgovor.send(korisnik);
			} else {
				odgovor.status(400);
				greska = "Netocni podaci!";
				console.log(greska);
			}
		}
	};
}
module.exports = HtmlUpravitelj;
async function ucitajStranicu(nazivStranice, korisnik) {
	let stranice = [ucitajHTML(nazivStranice), ucitajHTML("navigacija")];
	let [stranica, nav] = await Promise.all(stranice);

	if (korisnik === 1 || korisnik === 2) {
		if (korisnik === 1) {
			const registracija = '<a href="/registracija">Registracija</a>';
			const korisnici = '<a href="/korisnici">Korisnici</a>';
			const dnevnik = '<a href="/dnevnik">Dnevnik</a>';
			nav = nav.replace("#registracija#", registracija);
			nav = nav.replace("#korisnici#", korisnici);
			nav = nav.replace("#dnevnik#", dnevnik);
		} else {
			nav = nav.replace("#registracija#", "");
			nav = nav.replace("#korisnici#", "");
			nav = nav.replace("#dnevnik#", "");
		}

		const spremi =
			"<button onClick='dodajFavorita(podaci)'>Spremi u favorite</button>";
		stranica = stranica.replace("#spremi#", spremi);
		const obrisi =
			"<button onClick='obrisiFavorita(podaci.serija[0].tmdb_id)'>Obriši</button>";
		stranica = stranica.replace("#obrisi#", obrisi);

		const odjava = '<a href="/odjava">Odjava</a>';
		const profil = '<a href="/profil">Profil</a>';
		const favoriti = '<a href="/favoriti">Favoriti</a>';
		nav = nav.replace("#odjava#", odjava);
		nav = nav.replace("#profil#", profil);
		nav = nav.replace("#favoriti#", favoriti);
		nav = nav.replace("#prijava#", "");
		nav = nav.replace("#dnevnik#", "");
	} else {
		const prijava = '<a href="/prijava">Prijava</a>';
		nav = nav.replace("#registracija#", "");
		nav = nav.replace("#korisnici#", "");
		stranica = stranica.replace("#spremi#", "");
		stranica = stranica.replace("#obrisi#", "");
		nav = nav.replace("#odjava#", "");
		nav = nav.replace("#profil#", "");
		nav = nav.replace("#favoriti#", "");
		nav = nav.replace("#prijava#", prijava);
		nav = nav.replace("#dnevnik#", "");
	}

	stranica = stranica.replace("#navigacija#", nav);

	return stranica;
}

function ucitajHTML(htmlStranica) {
	if (htmlStranica == "dokumentacija") {
		return ds.readFile(
			__dirname + "/../dokumentacija/" + htmlStranica + ".html",
			"UTF-8"
		);
	}
	return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}
