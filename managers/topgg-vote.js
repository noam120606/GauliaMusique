const { Webhook } = require("@top-gg/sdk");
const webhook = new Webhook(process.env.topggAUTH);

const { REST } = require('discord.js');
const { UsersAPI, ChannelsAPI } = require('@discordjs/core');
const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);
const users = new UsersAPI(rest);
const channels = new ChannelsAPI(rest);

module.exports = (app, db) => {
    app.post(
        "/topgg",
        webhook.listener((vote) => {

            db.query(`SELECT * FROM vote WHERE user='${vote.user}'`, async (err, req) => {

                if (err) return console.error(err);

                if (req.length < 1) db.query(`INSERT INTO vote (user, count) VALUES ('${vote.user}', '1')`)
                else db.query(`UPDATE vote SET count = '${parseInt(req[0].count)+1}' WHERE user='${vote.user}'`)

                let count;
                if (req[0]) count = parseInt(req[0]?.count)+1;
                else count = 1;

                let channel = await users.createDM(vote.user);
                channels.createMessage(channel.id, {
                    content: `Merci beaucoup pour ton vote ! :heart:\nTu as au total voté \`${count}\` fois !`
                });

            });
            
        })
    );
};