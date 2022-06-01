# spotify-canvas

Based off the amazing work done in [itsmeow/Spicetify-Canvas](https://github.com/itsmeow/Spicetify-Canvas) ([Protobuf definitions](./lib/Protobuf.js) and [SPClient implementation](./lib/SPClient.js) extracted directly from that project!)

## Usage

```javascript
const getSpotifyCanvas = require("spotify-canvas");

getSpotifyCanvas({
	artist: "oneohtrix point never",
	album: "magic oneohtrix point never",
	track: "nothing's special",
}).then((result) => {
	console.log(result);
});

//https://canvaz.scdn.co/upload/licensor/16l9UjrgkeMuALfTijNQta/video/b342eebd7c664a049493f6e18369bf3e.cnvs.mp4
```
