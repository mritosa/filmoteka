const KorisnikDAO = require("./korisnikDAO.js");
const jwt = require("../moduli/jwt.js");

class RestKorisnik {
	constructor(tajniKljucJWT) {
		this.tajniKljucJWT = tajniKljucJWT;
	}

	getKorisnici = function (zahtjev, odgovor) {
		let uloga = zahtjev.session.uloga;
		console.log(zahtjev.session);
		odgovor.type("application/json");
		if (uloga == 1) {
			let kdao = new KorisnikDAO();
			console.log(zahtjev);
			kdao.dajSve().then((korisnici) => {
				console.log(korisnici);
				odgovor.status(200);
				odgovor.send(JSON.stringify(korisnici));
			});
		} else {
			let poruka = { opis: "zabranjen pristup" };
			odgovor.status(403);
			odgovor.send(JSON.stringify(poruka));
		}
	};

	postKorisnici = function (zahtjev, odgovor) {
		let uloga = zahtjev.session.uloga;
		odgovor.type("application/json");
		if (uloga == 1) {
			let podaci = zahtjev.body;
			podaci.tip_korisnika_id = 2;
			let kdao = new KorisnikDAO();
			kdao.dodaj(podaci).then((poruka) => {
				odgovor.send(JSON.stringify(poruka));
			});
		} else {
			let poruka = { opis: "zabranjen pristup" };
			odgovor.status(403);
			odgovor.send(JSON.stringify(poruka));
		}
	};
	putKorisnici = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};

	deleteKorisnici = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};

	getKorisnikPrijava = function (zahtjev, odgovor) {
		odgovor.type("json");
		console.log(zahtjev.session);
		if (zahtjev.session.korime != null) {
			let k = { korime: zahtjev.session.korime };
			let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
			odgovor.send({ ok: noviToken });
			return;
		}
		odgovor.status(401);
		odgovor.send({ greska: "zabranjen prustup" });
	};

	postKorisnikPrijava = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		let kdao = new KorisnikDAO();
		let korime = zahtjev.params.korime;
		kdao.daj(korime).then((korisnik) => {
			if (korisnik != null && korisnik.lozinka == zahtjev.body.lozinka) {
				odgovor.status(201);
				odgovor.send(JSON.stringify(korisnik));
			} else {
				odgovor.status(401);
				odgovor.send(JSON.stringify({ opis: "zabranjen pristup" }));
			}
		});
	};

	putKorisnikPrijava = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};

	deleteKorisnikPrijava = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(501);
		let poruka = { opis: "metoda nije implementirana" };
		odgovor.send(JSON.stringify(poruka));
	};
	getKorisnik = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		let kdao = new KorisnikDAO();
		let korime = zahtjev.params.korime;
		kdao.daj(korime).then((korisnik) => {
			console.log(korisnik);
			odgovor.send(JSON.stringify(korisnik));
		});
	};

	postKorisnik = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { opis: "zabranjeno" };
		odgovor.send(JSON.stringify(poruka));
	};

	putKorisnik = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		let korime = zahtjev.params.korime;
		let podaci = zahtjev.body;
		console.log("Tusam:" + podaci.lozinka);
		let kdao = new KorisnikDAO();
		kdao.azuriraj(korime, podaci).then((poruka) => {
			odgovor.status(201);
			odgovor.send(JSON.stringify(poruka));
		});
	};

	deleteKorisnik = function (zahtjev, odgovor) {
		odgovor.type("application/json");
		let uloga = zahtjev.session.uloga;
		if (uloga == 1) {
			let korime = zahtjev.params.korime;
			let podaci = zahtjev.body;
			let kdao = new KorisnikDAO();
			kdao.obrisi(korime, podaci).then((poruka) => {
				odgovor.status(201);
				odgovor.send(JSON.stringify(poruka));
			});
		} else {
			let poruka = { opis: "zabranjen pristup" };
			odgovor.send(JSON.stringify(poruka));
		}
	};
}
module.exports = RestKorisnik;
