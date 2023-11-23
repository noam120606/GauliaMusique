const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    name: "playerError",
    async run(client, queue, err) {
        console.error(err);
    }
};