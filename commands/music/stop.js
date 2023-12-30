const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Couper toute les musiques")
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
        //if (!track) return await interaction.followUp("Il n'y a pas de musiques en cours.");
        
        const queue = client.player.queues.get(interaction.guild);
        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");

        await queue.node.stop(true)
        await queue.delete();

        await interaction.followUp("La musique a bien été coupée !")

        const embed = new EmbedBuilder()
        .setTitle("⛔ Stop de musique")
        .setColor("#ffffff")
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(`La musique \`${track.title}\` a été stop par <@${interaction.user.id}>`)
        await interaction.channel.send({embeds: [embed]})
        
    }
};