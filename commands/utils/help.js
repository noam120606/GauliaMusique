const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Liste des commandes du bot")
    .addStringOption(opt => opt
        .setName("commande")
        .setDescription("La commande où vous souhaitez obtenir des informations")
        .setAutocomplete(true)
    )
    .setDMPermission(true),

    autocomplete: async (interaction) => {
        const entry = interaction.options.getFocused();
        const choices = entry == "" ? interaction.client.commands : interaction.client.commands.filter(cmd => cmd.data.name.includes(entry))
        const reponse = choices.map(cmd => ({name: cmd.data.name, value: cmd.data.name}));
        await interaction.respond(reponse);
    },

    run: async (interaction) => {

        const { client, options, guild } = interaction;
        const commandName = options.getString("commande");

        const embed  = new EmbedBuilder()

        if (commandName) {

            const command = client.commands.get(commandName);

            embed.setTitle(`Commande ${commandName}`)
            .setDescription([
                `**Nom:** \`${command.data.name}\``,
                `**Description:** \`${command.data.description}\``,
                `**Premium:** \`${command.premium?"✅":"❌"}\``,
                `**Utilisable en dm:** \`${command.data.dm_permission?"✅":"❌"}\``
            ].join('\n'))
            .setColor("#ffffff")

            
        
        } else {

            let description = "";
            for (const cmd of client.commands) description += `/${cmd[0]} \`${cmd[1].data.description}\`\n`;
            
            embed.setTitle("Liste des commandes")
            .setColor("#ffffff")
            .setDescription(description)
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }
};