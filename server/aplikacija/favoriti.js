const portRest = 12000;
class Favoriti {
	async dodajFavorita(serija) {
		let tijelo = {
			naziv: serija.name,
			opis: serija.overview,
			broj_sezona: serija.number_of_seasons,
			broj_epizoda: serija.number_of_episodes,
			popularnost: serija.popularity,
			slika: serija.slika,
			tmdb_id: serija.id,
			sezone: serija.sezone,
		};

		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/favoriti",
			parametri
		);

		if (odgovor.status == 201) {
			console.log("Favorit ubačen na servisu");
			return true;
		} else {
			console.log(odgovor.status);
			console.log(await odgovor.text());
			return false;
		}
	}
	async dajFavorita(tmdb_id) {
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");
		let parametri = {
			method: "GET",
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/favoriti/" + tmdb_id,
			parametri
		);
		if (odgovor.status == 200) {
			let podaci = await odgovor.text();
			let favorit = JSON.parse(podaci);
			return favorit;
		} else {
			return false;
		}
	}

	async brisiFavorita(tmdb_id) {
		console.log("tu sam");
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");
		let parametri = {
			method: "DELETE",
			body: JSON.stringify({ id: tmdb_id }),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + portRest + "/baza/favoriti/" + tmdb_id,
			parametri
		);
		if (odgovor.status == 201) {
			return odgovor.text();
		} else {
			return false;
		}
	}
}

module.exports = Favoriti;
