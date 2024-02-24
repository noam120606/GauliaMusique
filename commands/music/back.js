const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("recommence la musique précédente")
    .setDMPermission(false),

    run: async (interaction) => {

        let client = interaction.client;

        await interaction.deferReply({ephemeral: true});

        const memberVC = interaction.member.voice.channel;
        const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
        if (!memberVC) return await interaction.followUp("Tu n'es pas dans un salon vocal.");
        if (botVC && botVC != memberVC) return await interaction.followUp("Je suis déja utilisé dans un autre salon vocal.");
        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");
        if (!memberVC.joinable) return await interaction.followUp("Je n'ai pas la permission de rejoindre ce salon !");

        const queue = client.player.queues.get(interaction.guild);
        if (!queue) return await interaction.followUp(`Le bot ne joue pas de musique !`);
        if (!queue.history.previousTrack) return await interaction.followUp(`Il n'y a pas de musiques précédente !`);

        await queue.history.back();
        await interaction.followUp(`La musique précédente a bien été rejoué !`);

        const embed = new EmbedBuilder()
        .setTitle("↩️ Retour à la musique précédente")
        .setColor("#ffffff")
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(`La musique \`${queue.history.currentTrack.title}\` a été rejoué par <@${interaction.user.id}>`);
        await interaction.channel.send({embeds: [embed]});
    }
};