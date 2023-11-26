const loadCommands = require('./loaders/loadCommands');
const loadEvents = require('./loaders/loadEvents');
const loadDatabase = require('./loaders/loadDatabase');
const manageTopggVote = require("./managers/topgg-vote");
const manageTopggPost = require("./managers/topgg-autopost");
const manageUptimerobot = require("./managers/uptimerobot");

require('dotenv').config({ path: "./.env" });

const express = require("express");
const app = express();
app.listen(process.env.PORT);

const { Player } = require('discord-player');
const { Client, IntentsBitField, Collection } = require('discord.js');
const client = new Client({ intents: new IntentsBitField(process.env.INTENTS) });
client.dev = process.env.DEVBOT=="1"?true:false;
client.commands = new Collection();
client.config = require('./config.json');
client.player = new Player(client, {
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});
client.player.extractors.loadDefault();
client.player.blindtestdata = {};

(async () => {
    client.db = await loadDatabase(client);
    await loadCommands(client);
    await loadEvents(client);
    await client.login(process.env.TOKEN);

    if (!client.dev) {
        await manageTopggPost(client, app);
        await manageTopggVote(client, app);
        await manageUptimerobot(client, app);
    }
})();

process.on("unhandledRejection", (e) => { console.error(e) });
process.on("uncaughtException", (e) => { console.error(e) });
process.on("uncaughtExceptionMonitor", (e) => { console.error(e) });