const { Events, ActivityType } = require('discord.js');
const DisStat = require("disstat");

module.exports = {
    name: Events.ClientReady,
    async run(client) {

        client.application.commands.set(client.commands.map(command => command.data));
        client.user.setActivity(`${client.guilds.cache.size}/75 serveurs`, {type: ActivityType.Watching});
        setInterval(() => {
            client.user.setActivity(`${client.guilds.cache.size}/75 serveurs`, {type: ActivityType.Watching});
        }, 1 * 60 * 60 * 1000)
        console.log(`[startup] ${client.user.username} est en ligne`);
    }
};