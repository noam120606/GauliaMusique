const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { lyricsExtractor } = require('@discord-player/extractor');
const lyricsFinder = lyricsExtractor(/* 'optional genius API key' */);

module.exports = {

    premium: true,
    
    data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("⭐ Reçois les paroles de la musique en cours")
    .setDMPermission(false),

    run: async (interaction) => {
        const client = interaction.client;

        await interaction.deferReply({ephemeral: true});

        const track = client.player.queues?.cache?.get(interaction.guildId)?.currentTrack;
        if (!track) return interaction.followUp('Aucune musique ne se joue en ce moment.');

        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");

        const lyrics = await lyricsFinder.search(`${track.title} ${track.author}`).catch(() => null);
        if (!lyrics) return interaction.followUp('Aucune parole trouvée.');

        const splitedLyrics = lyrics.lyrics.toString().split('\n\n');

        const top = new EmbedBuilder()
            .setTitle(lyrics.title)
            .setURL(lyrics.url)
            .setThumbnail(lyrics.thumbnail)
            .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url
            })
            .setColor('#ffffff')
            .setDescription("<:beta1:1171196217699606588><:beta2:1171196218924347443><:beta3:1171196220979560558>");
        let embeds = [top];
        splitedLyrics.forEach(paragraphe => {
            const embed = new EmbedBuilder()
            .setDescription(paragraphe)
            .setColor('#ffffff');
            embeds.push(embed);
        });
        reponse = { embeds: embeds.slice(0,10) }
        if (embeds.length > 10) reponse.content = `Malheureusement, je n'ai pas pu ajouter d'autres paroles a cause des limitations discord`
        return await interaction.followUp(reponse);
    }
};