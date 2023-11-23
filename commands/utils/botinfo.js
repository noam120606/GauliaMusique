const { SlashCommandBuilder, EmbedBuilder, version } = require("discord.js");
const os = require(`os`);
const cpuStat = require(`cpu-stat`);

module.exports =  {

    data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Obtient des informations sur le bot")
    .setDMPermission(true),

    run: async (interaction) => {

        cpuStat.usagePercent(async (err, percent, seconds) => {

            let package = require('../../package.json')

            let client = interaction.client;
            let guildMusicStats = client.player.queues.get(interaction.guild)?.stats?.generate();
            let totalmember = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b);
            
            let embed = new EmbedBuilder()
            .setColor("#ffffff")
            .setTitle(`Information`)        
            .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            .addFields({
                name: 'Informations du bot', 
                value: [
                    `<:g_dev:1171091379682803713> **Développeur** : \`noam120606\``,
                    `<:g_app:1171091279501856808> **Nom** : \`${client.user.username}\``,
                    `<:g_id:1171091474927063120> **ID** : \`${client.user.id}\``,
                    `<:g_refresh:1171091649326235739> **Uptime :** \`${Math.round(client.uptime / (1000 * 60 * 60)) + "h " + (Math.round(client.uptime / (1000 * 60)) % 60) + "m " + (Math.round(client.uptime / 1000) % 60) + "s "}\``,
                    `<:g_info:1171091480610353203> **Versions :**`,
                    `gaulia-musique \`${package.version}\``,
                    `Discord.js \`v${version}\``,
                    `NodeJS \`${process.version}\``,
                    `Player \`v${package.dependencies["discord-player"].slice(1,package.dependencies["discord-player"].length)}\``
                ].join('\n'), 
                inline: true 
            })
            .addFields({
                name: 'Statistiques du bot', 
                value: [
                    `<:g_domain:1171091360024117269> **Serveurs** : \`${client.guilds.cache.size}\``,
                    `<:g_slash:1171091726497234944> **Commandes** : \`${client.commands.size}\``,
                    `<:g_members:1171091547014561835> **Membres** : \`${totalmember}\``,
                    `<:g_activity1:1171091270106620017> **CPU** : \`${percent.toFixed(2)}%\``,
                    `<:g_card:1171091319108681738> **RAM** : \`${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)}\` MB`
                ].join('\n'), 
                inline: true 
            })
            .addFields({ name: '\u200B', value: '\u200B' })
            .setTimestamp()
            .setFooter({text: `${client.user.tag} © 2023`, iconURL: (client.user.displayAvatarURL({dynamic: true}))});

            if (guildMusicStats) {
                embed.addFields({
                    name: 'Stats musique', 
                    value: [
                        `⏸️ **Etat de pause** : \`${guildMusicStats.status.paused?"✅":"❌"}\``,
                        `👤 **Auditeurs** : \`${guildMusicStats.listeners}\``,
                        `🎵 **Nb musiques** : \`${guildMusicStats.tracksCount}\``,
                        `💾 **Memoire utilisé** : \`${parseInt(guildMusicStats.memoryUsage.heapUsed/1000000)} Mb\``
                    ].join('\n'), 
                    inline: true 
                });
            };

            await interaction.reply({embeds: [embed], ephemeral: true});

        })
    } 
};