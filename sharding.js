require('dotenv').config({ path: "./.env" });
const devbot = process.env.DEVBOT=="1";
const config = require('./config.json');

const serviceUPTIMEROBOT = require('./managers/uptimerobot');
const serviceTOPGGVOTE = require('./managers/topgg-vote');
const loadDatabase = require('./loaders/loadDatabase');
const app = require('express')();
serviceUPTIMEROBOT(app);
serviceTOPGGVOTE(app, loadDatabase());
app.listen(process.env.PORT, () => {});

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./main.js', { token: process.env.TOKEN, totalShards: config.shardCount });

const { AutoPoster } = require("topgg-autoposter");
if (!devbot) AutoPoster(process.env.topggTOKEN, manager);

manager.on('shardCreate', shard => {
    shard.on("ready", () => {
        shard.send({type: "shardId", data: {shardId: shard.id}});
        console.log(`[SHARD] Shard #${shard.id} lancée`);
    });
});
manager.spawn();

process.on("unhandledRejection", (e) => { console.error(e) });
process.on("uncaughtException", (e) => { console.error(e) });
process.on("uncaughtExceptionMonitor", (e) => { console.error(e) });