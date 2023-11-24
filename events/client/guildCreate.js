const { Events, WebhookClient, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    async run(client, guild) {
        const webhookClient = await new WebhookClient({ id: process.env.WEBHOOKid, token: process.env.WEBHOOKtoken });
        let inv = Array.from((await guild.invites.fetch({cache: false})).keys())[0];
        let content = "Pas d'invitations existante";
        if (!inv === undefined) content = `discord.gg/${inv}`;
        let icon = "";
        if (guild.partnered) icon = "<:g_partner:1171091617730531391> ";
        if (guild.verified) icon = "<:g_verified:1171091756033515520> ";

        const embed = new EmbedBuilder()
        .setTitle(`${icon}${guild.name}`)
        .setFields(
            { name: "Membres", value: `${guild.memberCount}`, inline: true },
            { name: "Owner", value: `${(await guild.fetchOwner()).user.username} (${(await guild.fetchOwner()).id})`, inline: true }
        )
        .setThumbnail(guild.iconURL())
        .setColor("#57F287");
        webhookClient.send({
            content,
            embeds: [embed],
            username: "Gaulia Guild Join",
            avatarURL: client.user.displayAvatarURL()
        });
    }
};