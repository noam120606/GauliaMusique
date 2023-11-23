module.exports = {
    name: "error",
    async run(client, data) {
        client.channels.cache.get(client.config.errorChannel).send(data)
    }
};