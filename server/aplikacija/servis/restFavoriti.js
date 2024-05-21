const FavoritDAO = require("./favoritDAO.js");
const SerijeDAO = require("./serijeDAO.js");
const SezoneDAO = require("./sezoneDAO.js");

exports.getFavoriti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let korisnik_id = zahtjev.session.korisnik_id;

	let fdao = new FavoritDAO();
	fdao.dajSve(korisnik_id).then((favoriti) => {
		console.log(favoriti);
		odgovor.status(200);
		odgovor.send(JSON.stringify(favoriti));
	});
};

exports.postFavoriti = async function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let serija = zahtjev.body;
	let sezone = zahtjev.body.sezone;
	let serija_id = zahtjev.body.tmdb_id;
	let korisnik_id = zahtjev.session.korisnik_id;
	let fdao = new FavoritDAO();
	let sdao = new SerijeDAO();
	let sedao = new SezoneDAO();

	let postojiSerija = await sdao.provjeriSeriju(serija_id);
	let postojiFavorit = await fdao.provjeriFavorita(korisnik_id, serija_id);
	console.log(postojiFavorit);
	console.log(postojiSerija);
	if (postojiFavorit) {
		odgovor.status(409);
		let poruka = { greska: "favorit vec postoji" };
		odgovor.send(JSON.stringify(poruka));
	} else {
		if (postojiSerija) {
			fdao.dodaj(korisnik_id, serija_id).then((poruka) => {
				odgovor.status(201);
				odgovor.send(JSON.stringify(poruka));
			});
		} else {
			sdao.dodaj(serija).then((poruka) => {
				odgovor.status(201);
			});

			for (const sezona of sezone) {
				sedao.dodaj(sezona, serija_id);
			}

			fdao.dodaj(korisnik_id, serija_id).then((poruka) => {
				odgovor.status(201);
				odgovor.send(JSON.stringify(poruka));
			});
		}
	}
};

exports.putFavoriti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.deleteFavoriti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.getFavoritId = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let sdao = new SerijeDAO();
	let sedao = new SezoneDAO();
	let korisnik_id = zahtjev.session.korisnik_id;
	let serija_id = zahtjev.params.id;
	console.log(korisnik_id);
	Promise.all([sdao.daj(serija_id), sedao.dajSve(serija_id)]).then(
		([serijaPodaci, sezonaPodaci]) => {
			let podaci = {
				serija: serijaPodaci,
				sezona: sezonaPodaci,
				korisnik: korisnik_id,
			};
			odgovor.send(JSON.stringify(podaci));
		}
	);
};

exports.postFavoritId = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(405);
	let poruka = { greska: "zabranjeno" };
	odgovor.send(JSON.stringify(poruka));
};
exports.putFavoritId = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(405);
	let poruka = { greska: "zabranjeno" };
	odgovor.send(JSON.stringify(poruka));
};

exports.deleteFavoritId = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let serija_id = zahtjev.params.id;
	let korisnik = zahtjev.session.korisnik_id;
	let fdao = new FavoritDAO();
	fdao.obrisi(korisnik, serija_id).then((poruka) => {
		odgovor.status(201);
		odgovor.send(JSON.stringify(poruka));
	});
};

exports.deleteSviFavoriti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let korisnikId = zahtjev.params.id;
	let podaci = zahtjev.body;
	let fdao = new FavoritDAO();
	fdao.obrisiSve(korisnikId, podaci).then((poruka) => {
		odgovor.status(201);
		odgovor.send(JSON.stringify(poruka));
	});
};
