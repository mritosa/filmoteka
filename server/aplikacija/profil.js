const kodovi = require("./moduli/kodovi.js");

const portRest = 12000;
class Profil {
	async dajKorisnika(korime) {
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici/" + korime
		);
		
			let podaci = await odgovor.text();
			let korisnik = JSON.parse(podaci);
			return korisnik;
	
	}
	async azurirajKorisnika(korisnik) {
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");
		if (korisnik.lozinka === "") {
			korisnik["lozinka"] = korisnik.lozinka;
		} else {
			korisnik["lozinka"] = kodovi.kreirajSHA256(korisnik.lozinka, "moja sol");
		}

		let parametri = {
			method: "PUT",
			body: JSON.stringify(korisnik),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici/" + korisnik.korime,
			parametri
		);
		if (odgovor.status == 201) {
			return odgovor.text();
		} else return false;
	}
}

module.exports = Profil;
