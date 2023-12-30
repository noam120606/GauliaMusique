const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "playerStart",
    async run(client, queue, track) {

        if (client.player.blindtestdata[queue.metadata.guild.id] === undefined || client.player.blindtestdata[queue.metadata.guild.id].isStop === true) return;

        client.gauliaStats.postEvent("blindtestBoradcast");

        const blindtestembed = new EmbedBuilder()
        .setTitle("🎵 Quel est cette musique ?")
        .setColor("#ffffff")
        .setDescription([
            `Utilisez la commande \`/blindtest answer\` pour répondre !`,
            ``,
            `Il ne sera plus possible de trouver <t:${parseInt(Date.now()/1000)+60}:R> !`
        ].join('\n'))

        let musicData = client.player.blindtestdata[queue.metadata.guild.id].getTracks().filter((musique) => musique.uri === track.metadata.source.uri)[0];

        await queue.metadata.channel.send({embeds: [blindtestembed] }).then(msg => {
            client.player.blindtestdata[queue.metadata.guild.id].setExpire(Date.now()+60000);
            
            setTimeout(async () => {

                if (client.player.blindtestdata[queue.metadata.guild.id].isStop) return;
                if (client.player.blindtestdata[queue.metadata.guild.id].getId() != queue.metadata.custom_data["blindtestID"]) return;

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
                    if (client.player.blindtestdata[queue.metadata.guild.id].getId() != queue.metadata.custom_data["blindtestID"]) return;

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

                        try { await queue.metadata.channel.send({embeds: [endEmbed]}) } catch {};
                        client.player.blindtestdata[queue.metadata.guild.id].stop()
                        await queue.delete();
                    }

                }, 20*1000);

            }, 60*1000);

        });

        
    }
};