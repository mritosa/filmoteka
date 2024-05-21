const mail = require("./moduli/mail.js");
const kodovi = require("./moduli/kodovi.js");
const portRest = 12000;
class Autentifikacija {
	async dodajKorisnika(korisnik, uloga) {
		let tijelo = {
			ime: korisnik.ime,
			prezime: korisnik.prezime,
			email: korisnik.email,
			korime: korisnik.korime,
			tip_korisnika_id: uloga,
			lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
		};

		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici",
			parametri
		);

		if (odgovor.status == 200) {
			console.log("Korisnik ubačen na servisu");
			let mailPoruka =
				"Uspješno ste registrirani! Vaši podaci za prijavu su: korisničko ime:" +
				korisnik.korime +
				" i lozinka:" +
				korisnik.lozinka;
			let poruka = await mail.posaljiMail(
				"mritosa20@student.foi.hr",
				korisnik.email,
				"Podaci za prijavu",
				mailPoruka
			);
			return true;
		} else {
			console.log(odgovor.status);
			console.log(await odgovor.text());
			return false;
		}
	}

	async prijaviKorisnika(korime, lozinka) {
		lozinka = kodovi.kreirajSHA256(lozinka, "moja sol");
		let tijelo = {
			lozinka: lozinka,
		};
		console.log(lozinka);
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/korisnici/" + korime + "/prijava",
			parametri
		);

		if (odgovor.status == 201) {
			return await odgovor.text();
		} else {
			return false;
		}
	}
	async obrisiKorisnika(korisnik) {
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "DELETE",
			body: JSON.stringify({ id: korisnik.id }),
			headers: zaglavlje,
		};
		return await fetch(
			"http://localhost:" + portRest + "/baza/korisnici/" + korime,
			parametri
		);
	}
}

module.exports = Autentifikacija;
