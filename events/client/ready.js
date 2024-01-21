const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    async run(client) {

        client.application.commands.set(client.commands.map(command => command.data));

        setInterval(async () => {
            client.user.setActivity(`${(await client.shard.fetchClientValues('guilds.cache.size')).reduce((acc, guildCount) => acc + guildCount, 0)} serveurs`, {type: ActivityType.Watching});
        }, 5 * 60 * 1000);
        
        setTimeout(async () => {
            if (client.shardId == 0 && !client.dev) {
                const express = require("express");
                const app = express();
                app.listen(process.env.PORT);

                const manageTopggVote = require("../../managers/topgg-vote");
                const manageUptimerobot = require("../../managers/uptimerobot");
                await manageTopggVote(client, app);
                await manageUptimerobot(client, app);
            };
        }, 2000);
    }
};