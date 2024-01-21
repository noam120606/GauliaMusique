const { Events, InteractionType, PermissionsBitField } = require('discord.js');
const isPremium = require('../../functions/isPremium');
const requirePremium = require('../../functions/requirePremium');

module.exports = {
    name: Events.InteractionCreate,
    async run(client, interaction) {

        interaction.custom_data = {}

        switch (interaction.type) {

            case InteractionType.ApplicationCommand:

                const command = client.commands.get(interaction.commandName);

                if (command.premium && !(await isPremium(client, interaction.guild.id))) return await requirePremium(interaction);
                else await command.run(interaction);

            break;

            case InteractionType.ApplicationCommandAutocomplete:

                const autocompleteManager = client.commands.get(interaction.commandName).autocomplete;
                autocompleteManager(interaction);

            break;

            default:

                const name = interaction.customId.split("-")[0];
                const args = interaction.customId.split("-").slice(1);
                const file = client.interactions.find(i => i.name === name && i.type === interaction.componentType)
                if (!file) return;

                if (file.permission && !interaction.member.permissions.has(new PermissionsBitField(file.permission))) return await interaction.reply({
                    content:`Cette interaction demande la permission ${new PermissionsBitField(file.permission).toArray()}`,
                    ephemeral:true
                });

                await file.run(interaction, ...args);

            break;
        };
    }
};