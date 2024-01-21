const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const isPremium = require('../../functions/isPremium');

module.exports = {
    name: "playerStart",
    async run(client, queue, track) {

        if (!(client.player.blindtestdata[queue.metadata.guild.id] === undefined || client.player.blindtestdata[queue.metadata.guild.id].isStop === true)) return;
        
        const premium = await isPremium(client, queue.metadata.guild.id);

        const playembed = new EmbedBuilder()
        .setTitle("🎵 Musique en cours")
        .setColor("#ffffff")
        .setDescription([
            `Titre: [${track.title}](${track.url})`,
            `Source: \`${track.raw.source}\``,
            `Durée: \`${track.duration}\``,
            `Ajoutée par \`${track.requestedBy.username}\``
        ].join('\n'))
        .setImage(track.thumbnail);

        const pauseBTN = new ButtonBuilder()
            .setCustomId('cmd-pause')
            .setLabel('Pause')
            .setEmoji("⏸️")
            .setStyle(ButtonStyle.Secondary);
        const playBTN = new ButtonBuilder()
            .setCustomId('cmd-resume')
            .setLabel('Resume')
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Secondary);
        const skipBTN = new ButtonBuilder()
            .setCustomId('cmd-skip')
            .setLabel('Skip')
            .setEmoji("⏩")
            .setStyle(ButtonStyle.Secondary);
        const backBTN = new ButtonBuilder()
            .setCustomId('cmd-back')
            .setLabel('Back')
            .setEmoji('↩️')
            .setStyle(ButtonStyle.Secondary);
        const stopBTN = new ButtonBuilder()
            .setCustomId('cmd-stop')
            .setLabel('Stop')
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Primary);
            
        const shuffleBTN = new ButtonBuilder()
            .setCustomId('cmd-shuffle')
            .setEmoji("<:shuffle:1172656525022605414>")
            .setStyle(queue.isShuffling?ButtonStyle.Success:ButtonStyle.Danger);
        const loopBTN = new ButtonBuilder()
            .setCustomId('cmd-loop')
            .setEmoji("<:loop:1172656523021922405>")
            .setStyle(queue.repeatMode?ButtonStyle.Success:ButtonStyle.Danger);
        const volmBTN = new ButtonBuilder()
            .setCustomId('volume-moins')
            .setEmoji('🔉')
            .setStyle(ButtonStyle.Secondary);
        const volpBTN = new ButtonBuilder()
            .setCustomId('volume-plus')
            .setEmoji('🔊')
            .setStyle(ButtonStyle.Secondary);
        const pubBTN = new ButtonBuilder()
            .setLabel('Powered by KHeberg.fr')
            .setURL("https://discord.gg/kheberg")
            .setEmoji("1198622304364675152")
            .setStyle(ButtonStyle.Link);

        const row1 = new ActionRowBuilder()
            .addComponents(pauseBTN, playBTN, skipBTN, backBTN, stopBTN);
        
        const row2 = new ActionRowBuilder();
        if (premium) row2.addComponents(shuffleBTN, loopBTN, volmBTN, volpBTN, pubBTN);
        else row2.addComponents(shuffleBTN, loopBTN, pubBTN);
            

        try { await queue.metadata.channel.send({embeds: [playembed], components: [row1, row2] }) } catch {};
        
        
    }
};