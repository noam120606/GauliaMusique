const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('isomorphic-unfetch')
const { getTracks } = require('spotify-url-info')(fetch)
const BlindtestServerData = require("../../class/BlindtestServerData");
const isPremium = require('../../functions/isPremium');
const requirePremium = require('../../functions/requirePremium');
const generateId = require('../../functions/generateId');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blindtest")
        .setDescription("Commandes relatives au blindtest !")
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('start')
            .setDescription('Commencer un blindtest')
            .addStringOption(option => option
                .setName('type')
                .setMinLength(3)
                .setDescription('La catégorie du blindtest')
                .setRequired(true)
                .addChoices(
                    { name: 'toute génération', value: 'toute-generation.json' },
                    { name: 'Custom (lien requis)', value: 'custom' }
                )
            )
            .addStringOption(option => option
                .setName("lien")
                .setDescription("Le lien de la playlist spotify (seulement pour type custom)")
            )
            .addNumberOption(option => option
                .setName("taille")
                .setDescription("Le nombre de musiques du blindtest !")
                .setMinValue(5)
                .setMaxValue(80)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('answer')
            .setDescription('Donne ta réponse')
            .addStringOption(option => option
                .setName('reponse')
                .setDescription('ta réponse')
                .setRequired(true)
                .setMinLength(3)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('stop')
            .setDescription('Arrête le blindtest')
        )
        .addSubcommand(subcommand => subcommand
            .setName('leaderboard')
            .setDescription('⭐ Affiche le leaderboard du blindtest en cours')
        ),

    run: async (interaction) => {

        let client = interaction.client;
        
        if (interaction.options.getSubcommand() === "start") {
            await interaction.deferReply({ephemeral: true});
            const memberVC = interaction.member.voice.channel;
            const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
            if (!memberVC) return await interaction.followUp("Tu n'es pas dans un salon vocal.");
            if (botVC && botVC != memberVC) return await interaction.followUp("Je suis déja utilisé dans un autre salon vocal.");

            const songNumber = parseInt(interaction.options.get("taille")?interaction.options.get("taille").value:20);
            const queue = client.player.queues.get(interaction.guild);
            
            if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Il y a déja un blindtest en cours !");
            if (!memberVC.joinable) return await interaction.followUp("Je n'ai pas la permission de rejoindre ce salon !");
            await queue?.node?.stop(true);
            let type = interaction.options.getString('type');
            
            let data;
            if (type === "custom") {
                try {
                    const lien = interaction.options.getString('lien');
                    if (!lien) return await interaction.followUp("Le lien de playlist spotify est requis pour utiliser la type custom")
                        data = {
                            name: `Playlist custom de ${interaction.user.username}`,
                            tracks: await getTracks(lien)
                        };
                        if (data.tracks.length < songNumber) return await interaction.followUp(`Il faut une playlist avec plus de musiques que le nombre a jouer (ici ${songNumber}) !`)
                    } catch {
                        return await interaction.followUp("Le lien fourni est invalide !")
                    }
            } else data = require(`../../storage/playlists/${interaction.options.getString('type')}`);


            const blindtestID = generateId(32, "blinedtest");
            interaction.custom_data["blindtestID"] = blindtestID;
            client.player.blindtestdata[interaction.guild.id] = new BlindtestServerData(blindtestID);
            
            const songlist = data.tracks.sort(() => 0.5 - Math.random()).slice(0, songNumber);
            songlist.forEach(async song => {
                song.url = `https://open.spotify.com/${song.uri.split(":")[1]}/${song.uri.split(":")[2]}`;
                if (typeof song.artist === "string") song.stringartist = song.artist;
                else song.stringartist = song.artist.join('; ');
                const { track } = await client.player.play(memberVC, song.url, {
                    requestedBy: interaction.user,
                    nodeOptions: {
                        metadata: interaction,
                        volume: 70,
                        leaveOnStop: true,
                        leaveOnEmpty: true,
                        leaveOnEnd: false,
                        selfDeaf: true,
                        maxHistorySize: songNumber,
                        maxSize: songNumber
                    }
                });
            });
            client.player.blindtestdata[interaction.guild.id].setTracks(songlist);
            
            const startEmbed = new EmbedBuilder()
            .setTitle("🎵 Début du blindtest !")
            .setColor("#ffffff")
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription([
                `Catégorie : \`${data.name}\``,
                `Nombre de musiques : \`${songNumber}\``
            ].join('\n'));
            
            await interaction.channel.send({embeds: [startEmbed]});
            interaction.followUp("Le blindtest a bien été commencé ! (La première musique peut venir après quelques secondes)");
        
        
        } else if (interaction.options.getSubcommand() === "answer") {
            await interaction.deferReply({ephemeral: true});
            const premium = await isPremium(client, interaction.guild.id);
        
            const memberVC = interaction.member.voice.channel;
            const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
            if (!memberVC) return await interaction.followUp("Tu n'es pas dans un salon vocal.");
            if (botVC && botVC != memberVC) return await interaction.followUp("Je suis déja utilisé dans un autre salon vocal.");
        
            const queue = client.player.queues.get(interaction.guild);
            if (client.player.blindtestdata[interaction.guild.id] === undefined || client.player.blindtestdata[interaction.guild.id].isStop === true) return await interaction.followUp("Vous ne pouvez utiliser cette commande que pendant le mode blindtest");
            if (!queue.currentTrack) return await interaction.followUp("La musique n'est pas en cours, attends un petit peu...");
            if (client.player.blindtestdata[interaction.guild.id].hasVote(interaction.user)) return await interaction.followUp("Tu as déja répondu !");
        
            let reponse = interaction.options.getString("reponse").toLowerCase();
            if (formatReponse(reponse) < 3 && reponse!="***") return await interaction.followUp("Ta réponse est invalide")
            let trackData = client.player.blindtestdata[interaction.guild.id].getTracks().filter((song) => song.uri == "spotify:track:"+queue.currentTrack.raw.url.split('/')[queue.currentTrack.raw.url.split('/').length-1])[0];
            if (client.player.blindtestdata[interaction.guild.id].getExpire()<Date.now()) return await interaction.followUp("Tu ne peut pas donner de réponse en ce moment");
            
            if (formatReponse(trackData.name).includes(formatReponse(reponse)) || formatReponse(trackData.stringartist).includes(formatReponse(reponse))) {
                client.player.blindtestdata[interaction.guild.id].vote(interaction.user);
                let points = await client.player.blindtestdata[interaction.guild.id].appendPoint(interaction.user);
                interaction.followUp(`Bravo ! Vous avez bien trouvé la musique qui est [${trackData.name}](${trackData.url}) (\`${trackData.stringartist}\`)`);
                interaction.channel.send(`✅ <@${interaction.user.id}> a trouvé la bonne réponse !${premium?`\nIl a maintenant ${points} points !`:""}`);
            } else interaction.followUp(`Bien tenté, mais ce n'est pas la bonne réponse.`);

            function formatReponse(rep) {
                return rep
                    .toLowerCase()
                    .replaceAll("'", "")
                    .replaceAll(" ", "")
                    .replaceAll("é", "e")
                    .replaceAll("è", "e")
                    .replaceAll("ê", "e")
                    .replaceAll("à", "a")
                    .replaceAll("ç", "c")
                    .replaceAll("*", "")
            };
        

        } else if (interaction.options.getSubcommand() === "stop") {
            const premium = await isPremium(client, interaction.guild.id);

            await interaction.deferReply({ephemeral: true});
            
            const memberVC = interaction.member.voice.channel;
            const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
            if (!memberVC) return await interaction.followUp("Tu n'es pas dans un salon vocal.");
            if (botVC && botVC != memberVC) return await interaction.followUp("Je suis déja utilisé dans un autre salon vocal.");
            
            const queue = client.player.queues.get(interaction.guild);
            if (client.player.blindtestdata[interaction.guild.id] === undefined || client.player.blindtestdata[interaction.guild.id].isStop === true) return await interaction.followUp("Vous ne pouvez utiliser cette commande que pendant le mode blindtest");
            client.player.blindtestdata[interaction.guild.id].stop();
            
            await queue.node.stop(true);
            await queue.delete();
            
            const embed = new EmbedBuilder()
            .setTitle("⛔ Stop de musique")
            .setColor("#ffffff")
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(`Le blindtest a été stop par <@${interaction.user.id}>`);
            
            let board = client.player.blindtestdata[queue.metadata.guild.id].getLeaderboard();
            let stringDesc = "";
            for (let i = 0; i<(board.length>10?10:board.length); i++) {
                stringDesc+=`${i+1}) \`${board[i].user.username}\` ${board[i].points} points\n`;
            };
            
            const resultEmbed = new EmbedBuilder()
            .setTitle("🎵 Résultats du blindtest")
            .setColor("#ffffff")
            .setDescription(stringDesc==""?"Personne n'a marqué de points":stringDesc);
            let embeds = [embed];
            if (premium) embeds.push(resultEmbed);
            await interaction.channel.send({embeds});

            await interaction.followUp("Le blindtest a bien été stop !")
        
        
        } else if (interaction.options.getSubcommand() === "leaderboard") {
            const premium = await isPremium(client, interaction.guild.id);
            if (!premium) return await requirePremium(interaction);
        
            const memberVC = interaction.member.voice.channel;
            const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
            if (!memberVC) return await interaction.reply({content:"Tu n'es pas dans un salon vocal.", ephemeral: true});
            if (botVC && botVC != memberVC) return await interaction.reply({content:"Je suis déja utilisé dans un autre salon vocal.", ephemeral:true});
            if (client.player.blindtestdata[interaction.guild.id] === undefined || client.player.blindtestdata[interaction.guild.id].isStop === true) return await interaction.reply({content:"Vous ne pouvez utiliser cette commande que pendant le mode blindtest",ephemeral:true});
        
            const embed = client.player.blindtestdata[interaction.guild.id].getLeaderboard(interaction.user, true);
            interaction.reply({embeds: [embed], ephemeral: true});
        };
    }
};