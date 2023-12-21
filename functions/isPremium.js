const axios = require('axios');

module.exports = async (client, guildId) => {
    const response = await axios.get(`https://discord.com/api/v10/applications/${client.user.id}/entitlements`, {
        headers: {
            'Authorization': `Bot ${process.env.TOKEN}`
        }
    });
    await response.data.forEach(data => {
        if (guildId == data.guild_id) return true;
    });
    return false;
}