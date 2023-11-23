const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Affiche les 10 premières musiques de la queue")
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
        if (!track) return await interaction.followUp("Il n'y a pas de musiques en cours.");
        
        const queue = client.player.queues.get(interaction.guild);
        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");

        const queueString = queue.tracks.data.slice(0,10).map((song, i) => {
            return `${i+1}) [\`${song.duration}\`] [${song.title}](${song.url}) (demandé par <@${song.requestedBy.id}>)`;
        }).join('\n');

        const embed = new EmbedBuilder()
        .setTitle("🎶 File d'attente")
        .setColor("#ffffff")
        .setDescription([
            `**En cours:** [\`${track.duration}\`] [${track.title}](${track.url}) (demandé par <@${track.requestedBy.id}>)`,
            ``,
            queueString,
            `Taille totale de la queue : \`${queue.tracks.data.length}\``
        ].join('\n'));
        await interaction.followUp({embeds: [embed]});
    }
};