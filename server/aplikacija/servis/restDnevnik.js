const DnevnikDAO = require("./dnevnikDAO.js");

exports.getDnevnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let uloga = zahtjev.session.uloga;
	let ddao = new DnevnikDAO();
	if (uloga == 1) {
		ddao.daj().then((dnevnik) => {
			console.log(dnevnik);
			odgovor.status(200);
			odgovor.send(JSON.stringify(dnevnik));
		});
	} else {
		let poruka = { opis: "zabranjen pristup" };
		odgovor.status(403);
		odgovor.send(JSON.stringify(poruka));
	}
};
exports.postDnevnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.putDnevnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.deleteDnevnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};
