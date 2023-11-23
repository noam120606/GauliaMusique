const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Joue une musique")
    .setDMPermission(false)
    .addStringOption(option => option
        .setName("musique")
        .setDescription("La musique à jouer")
        .setRequired(true)
    ),

    run: async (interaction) => {

        const QueueLimit = 1000;

        let client = interaction.client;
        await interaction.deferReply({ephemeral: true});
        const song = interaction.options.getString("musique");

        const memberVC = interaction.member.voice.channel;
        const botVC = (await interaction.guild.members.fetchMe()).voice.channel;
        if (!memberVC) return await interaction.followUp("Tu n'es pas dans un salon vocal.");
        if (botVC && botVC != memberVC) return await interaction.followUp("Je suis déja utilisé dans un autre salon vocal.");
        const queue = client.player.queues.get(interaction.guild);
        if (client.player.blindtestdata[interaction.guild.id]?.isStop === false) return await interaction.followUp("Vous ne pouvez pas utiliser cette commande pendant le mode blindtest");

        try {
            const { track } = await client.player.play(memberVC, song, {
                requestedBy: interaction.user,
                nodeOptions: {
                    metadata: interaction,
                    volume: 70,
                    leaveOnStop: true,
                    leaveOnEmpty: true,
                    leaveOnEnd: false,
                    selfDeaf: true,
                    maxHistorySize: QueueLimit,
                    maxSize: QueueLimit
                }
            });

            await interaction.followUp(`La musique [${track.title}](${track.url}) (\`${track.duration}\`) a été ajoutée à la queue`);
        } catch(e) {
            if (e.name == "ERR_OUT_OF_SPACE") return await interaction.followUp(`La limite de la queue est atteinte (\`${QueueLimit}\`)`);
            if (e.name == "ERR_NO_RESULT") return await interaction.followUp(`La musique \`${song}\` n'a pas été trouvée !`);
            return console.error(e)
        };
    }
};