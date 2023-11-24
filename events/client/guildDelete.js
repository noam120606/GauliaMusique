const { Events, WebhookClient, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    async run(client, guild) {
        const webhookClient = await new WebhookClient({ id: process.env.WEBHOOKid, token: process.env.WEBHOOKtoken });
        let icon = "";
        if (guild.partnered) icon = "<:g_partner:1171091617730531391> ";
        if (guild.verified) icon = "<:g_verified:1171091756033515520> ";

        const embed = new EmbedBuilder()
        .setTitle(`${icon}${guild.name}`)
        .setThumbnail(guild.iconURL())
        .setColor("#ED4245");
        webhookClient.send({
            embeds: [embed],
            username: "Gaulia Guild Leave",
            avatarURL: client.user.displayAvatarURL()
        });
    }
};