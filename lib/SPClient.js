const fetch = require("node-fetch");
const { Protobuf } = require("./Protobuf");

const LOGGING = false;
const log = LOGGING ? console.log : () => {};

class SPClient {
	constructor() {
		this.spLocations = fetch("https://apresolve.spotify.com/?type=spclient")
			.then((res) => res.json())
			.then((res) => res.spclient)
			.catch((err) => {
				log("[Canvas/SPClient] Error while fetching spotify client!");
				log(err);
			});
	}

	/*
	 * Helper that auto-initializes
	 */
	static async create(token) {
		if (!token) {
			throw new Error("Must pass Spotify access token to .create(<token>)");
		}
		const spClient = new SPClient();
		spClient.setToken(token);
		return await spClient.init();
	}

	/*
	 * Must be called before any fetch requests! Resolves the server URLs
	 */
	async init() {
		this.spLocationsResolved = await this.spLocations;
		return this;
	}

	/*
	 * Retrieve a server URL from the list
	 */
	getSpLocation() {
		const randArray = (array) => {
			return array[Math.floor(Math.random() * array.length)];
		};

		return randArray(this.spLocationsResolved);
	}

	setToken(token) {
		this.token = token;
	}

	getToken() {
		return this.token;
	}

	/*
	 * Send the request as raw binary data so protobuf works properly
	 */
	fetchProtobufAuthRaw(urlExt, method, body) {
		return fetch("https://" + this.getSpLocation() + urlExt, {
			method: method,
			headers: {
				Authorization: `Bearer ${this.getToken()}`,
				"Content-Type": "application/x-protobuf",
			},
			body: body,
		})
			.then((res) => res.arrayBuffer())
			.catch((err) => {
				log(
					`[Canvas/SPClient] Error making protobuf request to hm:/${urlExt}!`
				);
				log(err);
			});
	}

	/*
	 * Pretty protobuf wrapper
	 */
	postCanvasRequest(track) {
		return this.fetchProtobufAuthRaw(
			"/canvaz-cache/v0/canvases",
			"POST",
			Protobuf.encodeRequest(track)
		)
			.then((res) => {
				log("[Canvas/SPClient] Request response (raw):");
				log(res);
				return Protobuf.decodeResponse(new Uint8Array(res));
			})
			.then((res) => {
				if (
					res === undefined ||
					!res.canvases ||
					res.canvases.length === undefined
				) {
					return { canvases: [] };
				}
				return res;
			});
	}
}

module.exports = { SPClient };
