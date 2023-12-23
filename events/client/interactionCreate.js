const { Events, InteractionType } = require('discord.js');
const isPremium = require('../../functions/isPremium');
const requirePremium = require('../../functions/requirePremium');
module.exports = {
    name: Events.InteractionCreate,
    async run(client, interaction) {

        if (!client.dev) client.disstat.postEvent(Events.InteractionCreate, interaction.user.id);

        client.gauliaStats.postEvent(Events.InteractionCreate);

        interaction.custom_data = {}
        if (interaction.type === InteractionType.ApplicationCommand) {
            client.gauliaStats.postCommand(interaction.commandName);
            if (!client.dev) client.disstat.postCommand(interaction.commandName, interaction.user.id);
            const command = client.commands.get(interaction.commandName);
            if (command.premium && !(await isPremium(client, interaction.guild.id))) return await requirePremium(interaction);
            else await command.run(interaction);
            console.log(`[Interaction] Commande "${interaction.commandName}" par ${interaction.user.username} (${interaction.user.id})`);
        };
        if (interaction.isButton()) {
            let args = interaction.customId.split('-');
            if (args[0] === "cmd") {
                const command = client.commands.get(args[1]);
                interaction.custom_data["button"] = true;
                await command.run(interaction);
                console.log(`[Interaction] Bouton commande "${args[1]}" par ${interaction.user.username} (${interaction.user.id})`);
            };
            if (args[0] === "action") {
                if(args[1] === "delete") {
                    interaction.message.delete();
                    console.log(`[Interaction] Bouton action "delete" par ${interaction.user.username} (${interaction.user.id})`);
                };
            };
        };
    }
};