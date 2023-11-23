const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Relance la lecture de la musique en pause")
    .setDMPermission(false),

    run: async (interaction) => {
        let client = interaction.client;
        await interaction.deferReply({ephemeral: true});

        const memberVC = interaction.member.voice.channel;
        const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
        if (!memberVC) return await interaction.followUp("Tu n'es pas dans un salon vocal.");
        if (!botVC) return await interaction.followUp("Je ne suis pas utilisé, utilise **/play** !");
        if (botVC != memberVC) return await interaction.followUp("Tu n'es pas dans le même salon vocal que moi.");

        const track = client.player.queues?.cache?.get(interaction.guildId)?.currentTrack;
        if (!track) return await interaction.followUp("Il n'y a pas de musiques à relancer");
        
        const queue = client.player.queues.get(interaction.guild);
        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");
        if (!queue?.node?.isPaused()) return await interaction.followUp("La musique est déja en cours");

        queue.node.setPaused(false);

        await interaction.followUp(`La lecture de la musique \`${track.title}\` a repris !`);
        const embed = new EmbedBuilder()
        .setTitle("▶ Reprise de la musique")
        .setColor("#ffffff")
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(`La lecture de la musique \`${track.title}\` a été relancé par <@${interaction.user.id}>`);
        await interaction.channel.send({embeds: [embed]});
    }
};