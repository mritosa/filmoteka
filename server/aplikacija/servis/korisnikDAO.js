const Baza = require("./baza.js");

class KorisnikDAO {
	constructor() {
		this.baza = new Baza("RWA2023mritosa20.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;";
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	};

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if (podaci.length == 1) return podaci[0];
		else return null;
	};

	dodaj = async function (korisnik) {
		console.log(korisnik);
		let sql = `INSERT INTO korisnik (ime,prezime,lozinka,email,korime,tip_korisnika_id) VALUES (?,?,?,?,?,?)`;
		let podaci = [
			korisnik.ime,
			korisnik.prezime,
			korisnik.lozinka,
			korisnik.email,
			korisnik.korime,
			2,
		];
		await this.baza.izvrsiUpit(sql, podaci);
		return true;
	};

	obrisi = async function (korime) {
		let sql = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql, [korime]);
		return true;
	};

	azuriraj = async function (korime, korisnik) {
		if (korisnik.lozinka === "") {
			let sql = `UPDATE korisnik SET ime=?, prezime=? WHERE korime=?`;
			let podaci = [korisnik.ime, korisnik.prezime, korime];
			await this.baza.izvrsiUpit(sql, podaci);
			return true;
		} else {
			let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=? WHERE korime=?`;
			let podaci = [korisnik.ime, korisnik.prezime, korisnik.lozinka, korime];
			await this.baza.izvrsiUpit(sql, podaci);
			return true;
		}
	};
}

module.exports = KorisnikDAO;
