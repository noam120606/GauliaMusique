const { ComponentType } = require("discord.js");

module.exports = {
    name: "volume",
    type: ComponentType.Button,
    
    async run(interaction, type) {

        const queue = interaction.client.player.queues.get(interaction.guild);

        let newVolume = type=="plus"? queue.node.volume+20 : queue.node.volume-20;
        if (newVolume < 0) newVolume = 0;
        if (newVolume > 200) newVolume = 200;

        await queue.node.setVolume(newVolume);
        await interaction.deferUpdate();
        
        console.log(`[Interaction] Bouton volume utilisé par ${interaction.user.username} (${interaction.user.id})`);

    }
};