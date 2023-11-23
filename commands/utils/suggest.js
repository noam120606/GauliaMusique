const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Ouvre l'interface de suggestion")
    .setDMPermission(true),

    run: async (interaction) => {
        let client = interaction.client;
        
        const modal = new ModalBuilder()
            .setCustomId('file-suggest')
            .setTitle('Suggestion pour le bot');

        const objetrow = new TextInputBuilder()
            .setCustomId('objet')
            .setLabel("Le titre de votre proposition")
            .setStyle(TextInputStyle.Short);

        const textrow = new TextInputBuilder()
            .setCustomId('text')
            .setLabel("La description de votre proposition")
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(objetrow);
        const secondActionRow = new ActionRowBuilder().addComponents(textrow);

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            time: 10 * 60 * 1000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => { return console.error(error) })

        if (submitted) {
            const [ objet, text ] = ["objet", "text"].map(key => submitted.fields.getTextInputValue(key))

            const channel = client.channels.cache.get(client.config.suggestChannel);

            const suggestEmbed = new EmbedBuilder()
            .setTitle("Une suggestion est arrivée !")
            .setTimestamp()
            .setColor("#ffffff")
            .setFooter({ text: interaction.user.tag, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png?size=256` })
            .setFields(
                { name: 'Titre', value: `\`\`\`${objet}\`\`\``},
                { name: 'Description', value: `\`\`\`${text}\`\`\`\n\Proposition de <@${interaction.user.id}>`}
            )
			const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("action-delete")
                    .setLabel('Supprimer')
                    .setStyle(ButtonStyle.Danger)
            )
            await submitted.reply({
                content: `✅ Votre suggestion a bien été prise en compte !\nMerci de nous aider à améliorer Gaulia !`,
                ephemeral: true
            })

            channel.send({embeds: [suggestEmbed], components: [row] })
        }

    }
};