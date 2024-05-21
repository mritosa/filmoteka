const Baza = require("./baza.js");

class SerijeDAO {
	constructor() {
		this.baza = new Baza("RWA2023mritosa20.sqlite");
	}
	daj = async function (serija_tmdb_id) {
		this.baza.spojiSeNaBazu();
		let sql = `
		SELECT * FROM serija WHERE tmdb_id = ?;
    `;
		var podaci = await this.baza.izvrsiUpit(sql, [serija_tmdb_id]);
		this.baza.zatvoriVezu();
		return podaci;
	};
	provjeriSeriju = async function (tmdb_id) {
		let sql = `SELECT * FROM serija WHERE tmdb_id = ?`;
		var podaci = await this.baza.izvrsiUpit(sql, [tmdb_id]);
		return podaci.length > 0;
	};
	dodaj = async function (serija) {
		console.log(serija);
		let sql = `INSERT INTO serija (naziv,opis,broj_sezona,broj_epizoda,popularnost,slika,tmdb_id) VALUES (?,?,?,?,?,?,?)`;
		let podaci = [
			serija.naziv,
			serija.opis,
			serija.broj_sezona,
			serija.broj_epizoda,
			serija.popularnost,
			serija.slika,
			serija.tmdb_id,
		];
		await this.baza.izvrsiUpit(sql, podaci);
		return true;
	};
}

module.exports = SerijeDAO;
