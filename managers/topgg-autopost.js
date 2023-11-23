const { AutoPoster } = require("topgg-autoposter");

module.exports = async (client, app) => {
    AutoPoster(process.env.topggTOKEN, client).on("posted", () => {
        console.log("[Webhooks] Données postées à top.gg");
    });
    console.log('[WebServer] module Top.gg (auto-poster) chargé')
}