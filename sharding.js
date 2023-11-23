require('dotenv').config({ path: "./.env" });
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./main.js', { token: process.env.TOKEN });

manager.on('shardCreate', shard => console.log(`[SHARD] Shard #${shard.id} lancé`));
manager.spawn();