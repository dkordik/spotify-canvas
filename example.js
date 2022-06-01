const getSpotifyCanvas = require("./index");

getSpotifyCanvas({
	artist: "oneohtrix point never",
	album: "magic oneohtrix point never",
	track: "nothing's special",
}).then((result) => {
	console.log(result);
});
