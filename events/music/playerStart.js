const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    name: "playerStart",
    async run(client, queue, track) {

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

        const blindtestembed = new EmbedBuilder()
        .setTitle("🎵 Quel est cette musique ?")
        .setColor("#ffffff")
        .setDescription([
            `Utilisez la commande \`/blindtest answer\` pour répondre !`,
            ``,
            `Il ne sera plus possible de trouver <t:${parseInt(Date.now()/1000)+60}:R> !`
        ].join('\n'))

        const pauseBTN = new ButtonBuilder()
            .setCustomId('cmd-pause')
            .setLabel('Pause')
            .setEmoji("⏸️")
            .setStyle(ButtonStyle.Secondary);
        const playBTN = new ButtonBuilder()
            .setCustomId('cmd-resume')
            .setLabel('Play')
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Secondary);
        const skipBTN = new ButtonBuilder()
            .setCustomId('cmd-skip')
            .setLabel('Skip')
            .setEmoji("⏩")
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
        const sourceBTN = new ButtonBuilder()
            .setLabel('Source')
            .setURL(track.url)
            .setEmoji("🎶")
            .setStyle(ButtonStyle.Link);

        const row1 = new ActionRowBuilder()
            .addComponents(pauseBTN, playBTN, skipBTN, stopBTN);
        
        const row2 = new ActionRowBuilder()
            .addComponents(shuffleBTN, sourceBTN)
            
            
        if (client.player.blindtestdata[queue.metadata.guild.id] === undefined || client.player.blindtestdata[queue.metadata.guild.id].isStop === true) {
            await queue.metadata.channel.send({embeds: [playembed], components: [row1, row2] });
        } else {
            
            let musicData = client.player.blindtestdata[queue.metadata.guild.id].getTracks().filter((musique) => musique.uri === track.metadata.source.uri)[0];
            // A CHANGER


            await queue.metadata.channel.send({embeds: [blindtestembed] }).then(msg => {
                client.player.blindtestdata[queue.metadata.guild.id].setExpire(Date.now()+60000);
                
                setTimeout(async () => {
                    if (client.player.blindtestdata[queue.metadata.guild.id].isStop) return;

                    const replyEmbed = new EmbedBuilder()
                    .setTitle("🎵 Réponse")
                    .setColor("#ffffff")
                    .setDescription([
                        `Titre: [${musicData.name}](${musicData.url})`,
                        `Artiste(s): \`${musicData.stringartist}\``,
                        ``,
                        `Prochaine musique <t:${parseInt(Date.now()/1000)+20}:R> !`
                    ].join('\n'))
                    .setImage(track.thumbnail);

                    await queue.metadata.channel.send({embeds: [replyEmbed]});

                    setTimeout(async () => {
                        if (client.player.blindtestdata[queue.metadata.guild.id].isStop) return;
                        queue.node.skip();
                        client.player.blindtestdata[queue.metadata.guild.id].clearVote();

                        if (queue.tracks.size==0) {
                            let board = client.player.blindtestdata[queue.metadata.guild.id].getLeaderboard();
                            let stringDesc = "";
                            for (let i = 0; i<(board.length>10?10:board.length); i++) {
                                stringDesc+=`${i+1}) \`${board[i].user.username}\` ${board[i].points} points\n`;
                            };

                            const endEmbed = new EmbedBuilder()
                            .setTitle("🎵 Fin du blindtest !")
                            .setColor("#ffffff")
                            .setDescription(stringDesc);

                            await queue.metadata.channel.send({embeds: [endEmbed]});
                            client.player.blindtestdata[queue.metadata.guild.id].stop()
                        }

                    }, 20*1000);

                }, 60*1000);

            });

        };
        
    }
};