const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("remote")
    .setDescription("Obtient les actions rapides du bot")
    .setDMPermission(false),

    run: async (interaction) => {
        let client = interaction.client;
        await interaction.deferReply({ephemeral: true});

        const memberVC = interaction.member.voice.channel;
        const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
        if (!memberVC) return await interaction.followUp("Tu n'es pas dans un salon vocal.");
        if (!botVC) return await interaction.followUp("Je ne suis pas utilisé, utilise **/play** !")
        if (botVC != memberVC) return await interaction.followUp("Tu n'es pas dans le même salon vocal que moi.");

        const queue = client.player.queues?.cache?.get(interaction.guildId)
        const track = queue?.currentTrack;

        const pauseBTN = new ButtonBuilder()
			.setCustomId('cmd-pause')
			.setLabel('Pause')
            .setEmoji("⏸️")
			.setStyle(ButtonStyle.Secondary);
        const playBTN = new ButtonBuilder()
            .setCustomId('cmd-resume')
            .setLabel('Play')
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Secondary);
		const skipBTN = new ButtonBuilder()
			.setCustomId('cmd-skip')
			.setLabel('Skip')
            .setEmoji("⏩")
			.setStyle(ButtonStyle.Secondary);
        const stopBTN = new ButtonBuilder()
			.setCustomId('cmd-stop')
			.setLabel('Stop')
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Primary);
        const shuffleBTN = new ButtonBuilder()
            .setCustomId('cmd-shuffle')
            .setLabel('Shuffle')
            .setEmoji("🔀")
            .setStyle(ButtonStyle.Secondary);
            
        let sourceBTN = new ButtonBuilder()
            .setLabel('Source')
            .setEmoji("🎶")
            .setStyle(ButtonStyle.Link);
            track ? sourceBTN.setURL(track.url) : sourceBTN.setDisabled(true).setURL('https://google.com')

		const row1 = new ActionRowBuilder()
            .addComponents(pauseBTN, playBTN, skipBTN, shuffleBTN, stopBTN);
        
        const row2 = new ActionRowBuilder()
            .addComponents(sourceBTN)

        await interaction.followUp({
            content: `Voici quelques actions rapide !`,
            components: [row1, row2]
        })
    }
};