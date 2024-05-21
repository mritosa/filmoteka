const TMDBklijent = require("./servis/klijentTMDB.js");
//const Konfiguracija = require("../konfiguracija.js");
//const KorisnikDAO = require("../servis/korisnikDAO.js");
const Autentifikacija = require("./autentifikacija.js");
const jwt = require("./moduli/jwt.js");
const Profil = require("./profil");
const Favoriti = require("./favoriti");

class FetchUpravitelj {
	constructor(api_kljuc, tajniKljucJWT) {
		this.tmdb = new TMDBklijent(api_kljuc);
		this.auth = new Autentifikacija();
		this.tajniKljucJWT = tajniKljucJWT;
		this.prof = new Profil();
		this.fav = new Favoriti();
	}

	serijePretrazivanje = function (zahtjev, odgovor) {
		console.log(this);
		odgovor.type("application/json");
		let stranica = zahtjev.query.stranica;
		let trazi = zahtjev.query.trazi;
		console.log(trazi);
		if (stranica == null || trazi == null) {
			odgovor.status(417);
			odgovor.send({ greska: "neocekivani podaci" });
			return;
		}

		this.tmdb
			.pretraziSerijePoNazivu(stranica, trazi)
			.then((serije) => {
				odgovor.send(serije);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	};

	prikaziProfil = async function (zahtjev, odgovor) {
		console.log(zahtjev);
//		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
//			odgovor.status(401);
//			odgovor.json({ greska: "neaoutorizirani pristup" });
//		} else {
			odgovor.json(await this.prof.dajKorisnika(zahtjev.session.korime));
//		}
	};

	favoritDetalji = async function (zahtjev, odgovor) {
		console.log(zahtjev);
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ greska: "neaoutorizirani pristup" });
		} else {
			odgovor.json(await this.fav.dajFavorita(zahtjev.body.serija_id));
		}
	};

	brisiFavorita = async function (zahtjev, odgovor) {
		console.log(zahtjev);
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ greska: "neaoutorizirani pristup" });
		} else {
			odgovor.json(await this.fav.brisiFavorita(zahtjev.body.tmdb_id));
		}
	};

	dodajFavorita = async function (zahtjev, odgovor) {
		console.log(zahtjev);
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ greska: "neaoutorizirani pristup" });
		} else {
			odgovor.json(await this.fav.dodajFavorita(zahtjev.body));
		}
	};


	serijaDetalji = function (zahtjev, odgovor) {
		console.log(this);
		odgovor.type("application/json");
		let tmdb_id = zahtjev.params.id;
		console.log(tmdb_id);
		if (tmdb_id == null) {
			odgovor.status(417);
			odgovor.send({ greska: "neocekivani podaci" });
			return;
		}
		this.tmdb
			.dohvatiDetaljeSerije(tmdb_id)
			.then((detalji) => {
				odgovor.send(detalji);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	};

	getJWT = async function (zahtjev, odgovor) {
		odgovor.type("json");
		console.log(zahtjev.session);
		if (zahtjev.session.korime != null) {
			let k = { korime: zahtjev.session.korime };
			let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
			odgovor.send({ ok: noviToken });
			return;
		}
		odgovor.status(401);
		odgovor.send({ greska: "nemam token!" });
	};
}

module.exports = FetchUpravitelj;
