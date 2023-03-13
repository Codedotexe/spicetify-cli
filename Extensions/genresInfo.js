//@ts-check

// NAME: GenresInfo
// AUTHOR: Codedotexe
// DESCRIPTION: Show the genres of a artist or a album

/// <reference path="../globals.d.ts" />

(function genresInfo() {
	const { CosmosAsync, ContextMenu, URI } = Spicetify;
	if (!(CosmosAsync && URI)) {
		setTimeout(genresInfo, 300);
		return;
	}

	async function showGenres(uris) {
		var request = new XMLHttpRequest();
		const uriObj = Spicetify.URI.fromString(uris[0]);
		const id = uris[0].split(":")[2];

		let res;
		if (uriObj.type === Spicetify.URI.Type.ARTIST) {
			res = await CosmosAsync.get("https://api.spotify.com/v1/artists/" + id);
		} else if (uriObj.type === Spicetify.URI.Type.ALBUM) {
			res = await CosmosAsync.get("https://api.spotify.com/v1/albums/" + id);
		} else {
			return; // Not an artist or album (should never happen)
		}

		Spicetify.PopupModal.display({
			title: "Genres",
			content: res.genres.length > 0 ? `Genres: ${res.genres.join(", ")}` : "No genres found",
		});
	}

	function isUriThisType(uris, uriType) {
		if (uris.length > 1) {
			return false;
		}
		const uri = uris[0];
		const uriObj = Spicetify.URI.fromString(uri);
		if (uriObj.type === uriType) {
			return true;
		}
		return false;
	}

	function isArtistURI(uris) {
		return isUriThisType(uris, Spicetify.URI.Type.ARTIST);
	}

	function isAlbumURI(uris) {
		return isUriThisType(uris, Spicetify.URI.Type.ALBUM);
	}

	const artistGenresContextMenu = new Spicetify.ContextMenu.Item("Show genres", showGenres, isArtistURI);
	artistGenresContextMenu.register();

	const albumGenresContextMenu = new Spicetify.ContextMenu.Item("Show genres", showGenres, isAlbumURI);
	albumGenresContextMenu.register();
})();
