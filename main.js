require('dotenv').config({ path: "./.env" });

const loadCommands = require('./loaders/loadCommands');
const loadEvents = require('./loaders/loadEvents');
const loadDatabase = require('./loaders/loadDatabase');
const loadInteractions = require('./loaders/loadInteractions');

const { YoutubeExtractor, SpotifyExtractor, AttachmentExtractor } = require("@discord-player/extractor");
const { Player } = require('discord-player');
const { Client, IntentsBitField, Collection } = require('discord.js');
const client = new Client({ intents: new IntentsBitField(process.env.INTENTS) });
const Stats = require('discord-live-stats');
client.dev = process.env.DEVBOT=="1";
client.commands = new Collection();
client.interactions = new Collection();
client.config = require('./config');
client.player = new Player(client, client.config.playerOptions);
client.player.extractors.register(SpotifyExtractor);
client.player.extractors.register(AttachmentExtractor);
client.player.extractors.register(YoutubeExtractor);
client.player.blindtestdata = {};
if (!client.dev) new Stats.Client(client, {
    stats_uri: 'http://gaulia-stats.noam120606.fr:20003/',
    authorizationkey: process.env.STATSAUTH,
});

client.db = loadDatabase();
loadCommands(client);
loadInteractions(client);
loadEvents(client);
client.login(process.env.TOKEN);
