module.exports = {
    name: "message",
    async run(client, message) {

        switch (message.type) {
            case "shardId":
                client.shardId = message.data.shardId;
            break;
        };
        
    }
};