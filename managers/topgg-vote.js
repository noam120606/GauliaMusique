const { Webhook } = require("@top-gg/sdk");
const webhook = new Webhook(process.env.topggAUTH);

module.exports = async (client, app) => {
    app.post(
        "/topgg",
        webhook.listener((vote) => {
            client.db.query(`SELECT * FROM vote WHERE user='${vote.user}'`, async (err, req) => {
                if (err) return console.error(err);
                if (req.length < 1) client.db.query(`INSERT INTO vote (user, count) VALUES ('${vote.user}', '1')`)
                else client.db.query(`UPDATE vote SET count = '${parseInt(req[0].count)+1}' WHERE user='${vote.user}'`)
                let count;
                if (req[0]) count = parseInt(req[0]?.count)+1;
                else count = 1;
                try {
                    client.users.cache.get(vote.user).send(`Merci beaucoup pour ton vote ! :heart:\nTu as au total voté \`${count}\` fois !`);
                    console.log(`[Vote] ${client.users.cache.get(vote.user).username} (${client.users.cache.get(vote.user).id}) à voté pour gaulia, total de ${count} vote(s)`)
                } catch {};
            })
        })
    );
}