const { AppleMusicExtractor,VimeoExtractor,SoundCloudExtractor,ReverbnationExtractor } = require("@discord-player/extractor");


module.exports = {

    shardCount: 8,

    playerOptions: {
/*
        blockStreamFrom: [
            AppleMusicExtractor.identifier,
            VimeoExtractor.identifier,
            SoundCloudExtractor.identifier,
            ReverbnationExtractor.identifier
        ],
        blockExtractors: [
            AppleMusicExtractor.identifier,
            VimeoExtractor.identifier,
            SoundCloudExtractor.identifier,
            ReverbnationExtractor.identifier
        ],
*/
        ytdlOptions: {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            dlChunkSize: 0,
            requestOptions: {
                headers: {
                    cookie: process.env.YOUTUBE_COOKIE
                }
            }
        }
    },

};
