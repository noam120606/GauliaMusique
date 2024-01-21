module.exports = {
    name: "message",
    async run(client, message) {
        if (message.type == "shardId") {
            client.shardId = message.data.shardId;
        };
    }
};