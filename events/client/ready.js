const { Events, ActivityType } = require('discord.js');
const DisStat = require("disstat");

module.exports = {
    name: Events.ClientReady,
    async run(client) {

        client.disstat = new DisStat(process.env.DISSTATtoken, client);
        client.application.commands.set(client.commands.map(command => command.data));

        client.user.setActivity(`${client.guilds.cache.size} serveurs`, {type: ActivityType.Watching});
        setInterval(() => {
            client.user.setActivity(`${client.guilds.cache.size} serveurs`, {type: ActivityType.Watching});
        }, 1 * 60 * 60 * 1000);

        console.log(`[startup] ${client.user.username} est en ligne`);

        client.gauliaStats.postEvent(Events.ClientReady);
        setInterval(() => {
            client.gauliaStats.postGlobalStats(client.guilds.cache.size, client.users.cache.size);
        }, 1*60*60*1000);
        
    }
};