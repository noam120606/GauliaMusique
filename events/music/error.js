module.exports = {
    name: "error",
    async run(client, queue, err) {
        client.gauliaStats.postEvent("dp-error");
        console.error(err);
    }
};