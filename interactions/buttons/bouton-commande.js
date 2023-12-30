const { ComponentType } = require("discord.js");

module.exports = {
    name: "cmd",
    type: ComponentType.Button,
    
    async run(interaction, commandName) {

        const command = interaction.client.commands.get(commandName);
        interaction.custom_data["button"] = true;

        await command.run(interaction);

        console.log(`[Interaction] Bouton commande "${commandName}" par ${interaction.user.username} (${interaction.user.id})`);

    }
};