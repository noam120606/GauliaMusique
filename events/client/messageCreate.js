const { Events, InteractionType } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async run(client, message) {
        if (message.author.bot) return;

        if (message.author.id === "457926967661035522") {
            if (message.content === ".list") {
                message.delete()
                message.author.send("# Liste des serveurs m'ayant comme bot :")
                client.guilds.cache.forEach(async (guild) => {
                    let inv = Array.from((await guild.invites.fetch({cache: false})).keys())[0]
                    message.author.send([
                        `Nom: ${guild.name}`,
                        `Id: ${guild.id}`,
                        `Membres: ${guild.memberCount}`,
                        `discord.gg/${inv}`
                    ].join('\n'))
                });
            };
        };

    }
};