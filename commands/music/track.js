const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { lyricsExtractor } = require('@discord-player/extractor');
const lyricsFinder = lyricsExtractor(/* 'optional genius API key' */);
const askGpt = require('../../functions/askgpt');

module.exports = {

    premium: true,
    
    data: new SlashCommandBuilder()
    .setName("track")
    .setDescription("⭐ Reçois des informations sur la musique en cours")
    .setDMPermission(false),

    run: async (interaction) => {
        const client = interaction.client;

        await interaction.deferReply({ephemeral: true});

        const track = client.player.queues?.cache?.get(interaction.guildId)?.currentTrack;
        if (!track) return interaction.followUp('Aucune musique ne se joue en ce moment.');

        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");

        const lyrics = await lyricsFinder.search(`${track.title} ${track.author}`).catch(() => null);
        if (!lyrics) return interaction.followUp('Cette musique n\'a pas été trouvée');

        const stringLyrics = lyrics.lyrics.toString();

        const prompt = [
            `Je vais te fournir des informations sur une musique, ton role est de me les résumer, décrit les paroles, les pensées de l'autaur, le nom, etc, tout ce qui peut être utile`,
            `Il faut un résumé bref (si ton message final fait plus de 2000 characteres, il y aura une enorme erreur), mais précis, je compte sur toi`,
            `ta réponse est destiné a être utilisé dans une application, ne donne donc pas de demandes, même si tu manque d'informations, essaie, si il t'es véritablement impossible de compléter ma demande, dit simplement "Désolé, une erreur interne est survenue"`,
            `L'auteur de la musique est "${track.author}", son titre est "${track.title}".`,
            `Voici les paroles :`, stringLyrics.split('\n').join("  ")
        ];

        const response = await askGpt(prompt.join(' '));

        return await interaction.followUp(response);
    }
};