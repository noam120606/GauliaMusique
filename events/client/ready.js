const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    async run(client) {

        client.application.commands.set(client.commands.map(command => command.data));
        
        setInterval(async () => {
            const guildCount = (await client.shard.fetchClientValues('guilds.cache.size')).reduce((acc, guildCount) => acc + guildCount, 0);
            client.user.setActivity(`${guildCount} serveurs`, {type: ActivityType.Watching});
        }, 5 * 60 * 1000);

    }
};