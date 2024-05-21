const Baza = require("./baza.js");

class FavoritDAO {
	constructor() {
		this.baza = new Baza("RWA2023mritosa20.sqlite");
	}
	dajSve = async function (korisnik_id) {
		this.baza.spojiSeNaBazu();
		let sql = `
        SELECT serija.*
        FROM serija
        INNER JOIN favoriti ON serija.tmdb_id = favoriti.serija_tmdb_id
        INNER JOIN korisnik ON korisnik.id = favoriti.korisnik_id
        WHERE korisnik.id = ?;
    `;
		var podaci = await this.baza.izvrsiUpit(sql, [korisnik_id]);
		this.baza.zatvoriVezu();
		return podaci;
	};

	dodaj = async function (korisnik_id, serija_id) {
		let sql = `INSERT INTO favoriti (korisnik_id,serija_tmdb_id) VALUES (?,?)`;
		let podaci = [korisnik_id, serija_id];
		await this.baza.izvrsiUpit(sql, podaci);
		return true;
	};
	obrisiSve = async function (korisnik_id) {
		let sql = "DELETE FROM favoriti WHERE korisnik_id=?";
		await this.baza.izvrsiUpit(sql, [korisnik_id]);
		return true;
	};

	obrisi = async function (korisnik_id, serija_id) {
		let sql = "DELETE FROM favoriti WHERE korisnik_id=? AND serija_tmdb_id=?";
		await this.baza.izvrsiUpit(sql, [korisnik_id, serija_id]);
		return true;
	};

	provjeriFavorita = async function (korisnik_id, tmdb_id) {
		let sql = `SELECT * FROM favoriti WHERE korisnik_id=? AND serija_tmdb_id=? `;
		var podaci = await this.baza.izvrsiUpit(sql, [korisnik_id, tmdb_id]);
		return podaci.length > 0;
	};
}

module.exports = FavoritDAO;
