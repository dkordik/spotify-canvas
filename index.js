const SpotifyWebApi = require("spotify-web-api-node");
const { SPClient } = require("./lib/SPClient");
const getSpotifyAccessToken = require("./lib/getSpotifyAccessToken");

module.exports = ({ artist, album, track }) => {
	const spotifyApi = new SpotifyWebApi();

	let accessToken;

	return getSpotifyAccessToken()
		.then((newAccessToken) => {
			accessToken = newAccessToken;

			spotifyApi.setAccessToken(accessToken);
			return spotifyApi.search(
				`track:"${track}" album:"${album}" artist:"${artist}"`,
				["track"]
			);
		})
		.then((searchResult) => {
			try {
				return Promise.resolve(searchResult.body.tracks.items[0]);
			} catch (e) {
				return Promise.reject(e);
			}
		})
		.then((track) => {
			return SPClient.create(accessToken).then((spClient) => {
				return spClient.postCanvasRequest(track.uri).then((result) => {
					return result;
				});
			});
		})
		.then((result) => result.canvases[0].url);
};
