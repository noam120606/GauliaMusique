const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Active ou non la répétition de la queue")
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
        if (!track) return await interaction.followUp("Il n'y a pas de musiques à répéter");
        
        const queue = client.player.queues.get(interaction.guild);
        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");
        
        if (queue.repeatMode) await queue.setRepeatMode(0);
        else await queue.setRepeatMode(2);

        await interaction.followUp(`Le mode loop a bien été ${queue.repeatMode?"activé":"désactivé"} !`);
        const embed = new EmbedBuilder()
        .setTitle("🔁 loop de la musique")
        .setColor("#ffffff")
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(`La queue ${queue.repeatMode?"est désormais":"n'est plus"} en mode loop (demandé par <@${interaction.user.id}>)`);
        await interaction.channel.send({embeds: [embed]});

        if (interaction.custom_data?.button) {
            if (interaction.message.type == 20) return;
            const newActionRowEmbeds = interaction.message.components.map((oldActionRow) => {
                const updatedActionRow = new ActionRowBuilder();
                updatedActionRow.addComponents(
                    oldActionRow.components.map((buttonComponent) => {
                        if (buttonComponent.customId !== "cmd-loop") return buttonComponent
                        const newButton = ButtonBuilder.from(buttonComponent);
                        newButton.setStyle(queue.repeatMode?ButtonStyle.Success:ButtonStyle.Danger);
                        return newButton;
                    }),
                );
                return updatedActionRow;
            });
            interaction.message.edit({ components: newActionRowEmbeds });
        }
    }
};