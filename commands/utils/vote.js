const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote pour le bot pour me soutenir !")
    .setDMPermission(true),

    run: async (interaction) => {
        let client = interaction.client;

        const embed = new EmbedBuilder()
        .setThumbnail("https://www.freeiconspng.com/thumbs/up-arrow-png/up-arrow-png-27.png")
        .setDescription("Si tu souhaites voter, le bouton de la page et en dessous, pour l'instant, ça ne donne rien, mais je sauvegarde quand même qui vote et combien de fois pour de potentielles futures récompenses !")
        .setColor("#ffffff");

        let voteBTN = new ButtonBuilder()
            .setLabel('Voter pour Gaulia !')
            .setEmoji("🎶")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://top.gg/fr/bot/${client.user.id}/vote`);

		const row = new ActionRowBuilder().addComponents(voteBTN);

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};