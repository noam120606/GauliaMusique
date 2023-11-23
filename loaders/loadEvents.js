const { readdirSync } = require('fs');

module.exports = async client => {
    let count = 0;
    const dirEvents = readdirSync("./events/");
    for (const dir of dirEvents) {
        const fileDirs = readdirSync(`./events/${dir}/`).filter(f => f.endsWith('.js'));
        for (const file of fileDirs) {
            const event = require(`../events/${dir}/${file}`);
            if (dir === "music") client.player.events.on(event.name, (...args) => event.run(client, ...args));
            if (dir === "client") client.on(event.name, (...args) => event.run(client, ...args));
            if (dir === "pterosocket") client.pterosocket.on(event.name, (...args) => event.run(client, ...args));
            count++;
        };
    };
    console.log(`[startup] ${count} events chargé`);
};