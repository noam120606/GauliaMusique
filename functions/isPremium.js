const axios = require('axios');

module.exports = async (client, guildId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`https://discord.com/api/v10/applications/${client.user.id}/entitlements`, {
                headers: {
                    'Authorization': `Bot ${process.env.TOKEN}`
                }
            });
            let itemsProcessed = 0;

            await response.data.forEach(data => {
                if (guildId == data.guild_id) resolve(true);
                itemsProcessed++;
                if(itemsProcessed === response.data.length) {
                    resolve(false);
                }
            });
        } catch {
            resolve(false)
        }
    })
}