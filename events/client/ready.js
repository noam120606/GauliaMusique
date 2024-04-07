const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    async run(client) {

        client.application.commands.set(client.commands.map(command => command.data));

        setInterval(async () => {
            const guildCount = (await client.shard.fetchClientValues('guilds.cache.size')).reduce((acc, guildCount) => acc + guildCount, 0);
            client.user.setActivity(`${guildCount} serveurs`, {type: ActivityType.Watching});
        }, 5 * 60 * 1000);

	var originalConsoleLog = console.log;
	console.log = function() {
    		args = [];
    		args.push( '[' + client.shardId ?? process.pid + '] ' );
    		for( var i = 0; i < arguments.length; i++ ) {
        		args.push( arguments[i] );
    		}
    		originalConsoleLog.apply( console, args );
	};

    }
};
