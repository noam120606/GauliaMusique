module.exports = {

    shardCount: 8,

    playerOptions: {
        ytdlOptions: {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            requestOptions: {
                headers: {
                    cookie: process.env.YOUTUBE_COOKIE
                }
            }
        },
        ipconfig: {
            blocks: ['fa25::/48', '2001:2::/48']
        },
    },

};