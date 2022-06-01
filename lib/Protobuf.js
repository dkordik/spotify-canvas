const protobuf = require("protobufjs");

const LOGGING = false;
const log = LOGGING ? console.log : () => {};

class Protobuf {
	static root = protobuf.Root.fromJSON({
		nested: {
			com: {
				nested: {
					spotify: {
						nested: {
							canvazcache: {
								options: {
									optimize_for: "CODE_SIZE",
									java_package: "com.spotify.canvaz",
								},
								nested: {
									Artist: {
										fields: {
											uri: {
												type: "string",
												id: 1,
											},
											name: {
												type: "string",
												id: 2,
											},
											avatar: {
												type: "string",
												id: 3,
											},
										},
									},
									EntityCanvazResponse: {
										fields: {
											canvases: {
												rule: "repeated",
												type: "Canvaz",
												id: 1,
											},
											ttlInSeconds: {
												type: "int64",
												id: 2,
											},
										},
										nested: {
											Canvaz: {
												fields: {
													id: {
														type: "string",
														id: 1,
													},
													url: {
														type: "string",
														id: 2,
													},
													fileId: {
														type: "string",
														id: 3,
													},
													type: {
														type: "canvaz.Type",
														id: 4,
													},
													entityUri: {
														type: "string",
														id: 5,
													},
													artist: {
														type: "Artist",
														id: 6,
													},
													explicit: {
														type: "bool",
														id: 7,
													},
													uploadedBy: {
														type: "string",
														id: 8,
													},
													etag: {
														type: "string",
														id: 9,
													},
													canvasUri: {
														type: "string",
														id: 11,
													},
												},
											},
										},
									},
									EntityCanvazRequest: {
										fields: {
											entities: {
												rule: "repeated",
												type: "Entity",
												id: 1,
											},
										},
										nested: {
											Entity: {
												fields: {
													entityUri: {
														type: "string",
														id: 1,
													},
													etag: {
														type: "string",
														id: 2,
													},
												},
											},
										},
									},
								},
							},
							canvaz: {
								options: {
									optimize_for: "CODE_SIZE",
									java_package: "com.spotify.canvaz",
								},
								nested: {
									Type: {
										values: {
											IMAGE: 0,
											VIDEO: 1,
											VIDEO_LOOPING: 2,
											VIDEO_LOOPING_RANDOM: 3,
											GIF: 4,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});

	static EntityCanvazRequest = this.root.lookupType(
		"com.spotify.canvazcache.EntityCanvazRequest"
	);

	static EntityCanvazResponse = this.root.lookupType(
		"com.spotify.canvazcache.EntityCanvazResponse"
	);

	static encodeRequest(track) {
		log("[Canvas/Protobuf] Encoding request for track:", track);
		return this.EntityCanvazRequest.encode(
			this.EntityCanvazRequest.create({
				entities: [{ entityUri: track }],
			})
		).finish();
	}

	static decodeResponse(buffer) {
		let res;
		try {
			res = this.EntityCanvazResponse.decode(buffer);
			log("[Canvas/Protobuf] Decoded canvas request:");
			log(res);
		} catch (error) {
			log("[Canvas/Protobuf] Error decoding canvas request response body!");
			log(error);
			try {
				let json = JSON.parse(new TextDecoder().decode(buffer));
				log("[Canvas/Protobuf] Got JSON response:");
				log(json);
			} catch (error2) {}
		}
		return res;
	}
}

module.exports = { Protobuf };
