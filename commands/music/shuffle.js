const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Active ou non le choix aléatoire de la musique")
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
        if (!track) return await interaction.followUp("Il n'y a pas de musiques à piocher aléatoirement");
        
        const queue = client.player.queues.get(interaction.guild);
        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");
        
        let enabled = queue.toggleShuffle();

        await interaction.followUp(`Le mode shuffle a bien été ${enabled?"activé":"désactivé"} !`);
        const embed = new EmbedBuilder()
        .setTitle("🔀 Shuffle de la musique")
        .setColor("#ffffff")
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(`La queue ${enabled?"est désormais":"n'est plus"} en mode shuffle (demandé par <@${interaction.user.id}>)`);
        await interaction.channel.send({embeds: [embed]});

        if (interaction.custom_data?.button) {
            if (interaction.message.type == 20) return;
            const newActionRowEmbeds = interaction.message.components.map((oldActionRow) => {
                const updatedActionRow = new ActionRowBuilder();
                updatedActionRow.addComponents(
                    oldActionRow.components.map((buttonComponent) => {
                        if (buttonComponent.customId !== "cmd-shuffle") return buttonComponent
                        const newButton = ButtonBuilder.from(buttonComponent);
                        newButton.setStyle(enabled?ButtonStyle.Success:ButtonStyle.Danger);
                        return newButton;
                    }),
                );
                return updatedActionRow;
            });
            interaction.message.edit({ components: newActionRowEmbeds });
        }
    }
};