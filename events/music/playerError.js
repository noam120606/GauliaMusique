module.exports = {
    name: "playerError",
    async run(client, queue, err) {
        client.gauliaStats.postEvent("player-error");
        console.error(err);
    }
};