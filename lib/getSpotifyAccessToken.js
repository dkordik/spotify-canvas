const fetch = require("node-fetch");

module.exports = () => {
	// Get anonymous web client access token,
	// as normal API keys don't have access to request canvases :(
	return fetch("https://open.spotify.com/")
		.then((response) => response.text())
		.then((text) => {
			let accessToken;
			try {
				accessToken = text.match(/"accessToken":"(.+?)"/)[1];
			} catch (e) {
				return Promise.reject(e);
			}
			return accessToken;
		});
};
