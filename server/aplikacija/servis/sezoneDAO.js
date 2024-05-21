const Baza = require("./baza.js");

class SezoneDAO {
	constructor() {
		this.baza = new Baza("RWA2023mritosa20.sqlite");
	}

	dajSve = async function (tmdb_id) {
		this.baza.spojiSeNaBazu();
		let sql = `SELECT * FROM sezona WHERE serija_tmdb_id=?`;
		var podaci = await this.baza.izvrsiUpit(sql, [tmdb_id]);
		this.baza.zatvoriVezu();
		return podaci;
	};

	dodaj = async function (sezone, serija_id) {
		console.log(sezone);
		let sql = `INSERT INTO sezona (naziv,opis,slika,broj_sezone,broj_epizoda_u_sezoni,tmdb_id_sezone,serija_tmdb_id) VALUES (?,?,?,?,?,?,?)`;
		let podaci = [
			sezone.name,
			sezone.overview,
			sezone.poster_path,
			sezone.season_number,
			sezone.episode_count,
			sezone.id,
			serija_id,
		];
		await this.baza.izvrsiUpit(sql, podaci);
		return true;
	};
}

module.exports = SezoneDAO;
