const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readFileSync } = require('fs');

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("changelog")
    .setDescription("Obtient les derniers changements du bot")
    .setDMPermission(true),

    run: async (interaction) => {
        let client = interaction.client;

        const embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(readFileSync("./changelog", "utf8"));

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};