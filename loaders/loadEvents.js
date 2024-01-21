const { readdirSync } = require('fs');

module.exports = async client => {
    const dirEvents = readdirSync("./events/");
    for (const dir of dirEvents) {
        const fileDirs = readdirSync(`./events/${dir}/`).filter(f => f.endsWith('.js'));
        for (const file of fileDirs) {
            const event = require(`../events/${dir}/${file}`);
            if (dir === "music") client.player.events.on(event.name, (...args) => event.run(client, ...args));
            if (dir === "client") client.on(event.name, (...args) => event.run(client, ...args));
            if (dir === "process" && !client.dev) process.on(event.name, (...args) => event.run(client, ...args));
        };
    };
};