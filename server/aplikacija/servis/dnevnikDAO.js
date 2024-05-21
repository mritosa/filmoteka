const Baza = require("./baza.js");

class DnevnikDAO {
	constructor() {
		this.baza = new Baza("RWA2023mritosa20.sqlite");
	}
	daj = async function () {
		this.baza.spojiSeNaBazu();
		let sql = `
 SELECT * FROM dnevnik;
    `;
		var podaci = await this.baza.izvrsiUpit(sql);
		this.baza.zatvoriVezu();
		return podaci;
	};
}

module.exports = DnevnikDAO;
