const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Obtient le ping du bot")
    .setDMPermission(true),

    run: async (interaction) => {
        let client = interaction.client;
        
        await interaction.reply({
            content: `Le ping du bot est \`${client.ws.ping}\` ms`,
            ephemeral: true
        });
    }
};