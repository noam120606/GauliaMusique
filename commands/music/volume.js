const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change le volume de la musique")
    .setDMPermission(false)
    .addNumberOption(option => option
        .setName("volume")
        .setDescription("Le volume à appliquer")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(200)
    ),

    run: async (interaction) => {

        let client = interaction.client;

        await interaction.deferReply({ephemeral: true});
        const song = interaction.options.getString("musique");

        const memberVC = interaction.member.voice.channel;
        const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
        if (!memberVC) return await interaction.followUp("Tu n'es pas dans un salon vocal.");
        if (botVC && botVC != memberVC) return await interaction.followUp("Je suis déja utilisé dans un autre salon vocal.");

        const volume = interaction.options.getNumber("volume");
        const queue = client.player.queues.get(interaction.guild);
        if (queue.node.volume == volume) return await interaction.followUp(`Le volume est déja à \`${volume}%\` !`);

        await interaction.followUp(`Le volume est passé de \`${queue.node.volume}%\` à \`${volume}%\` !`);
        const embed = new EmbedBuilder()
        .setTitle("🔊 Volume de la musique")
        .setColor("#ffffff")
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(`Le volume est passé de \`${queue.node.volume}%\` à \`${volume}%\` avec l'intervention de <@${interaction.user.id}>`)

        await queue.node.setVolume(volume);

        await interaction.channel.send({embeds: [embed]})

    }
};