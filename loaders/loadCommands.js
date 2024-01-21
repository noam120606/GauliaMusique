const { readdirSync } = require('fs');

module.exports = async client => {
    const dirsCommands = readdirSync("./commands/");
    for (const dir of dirsCommands) {
        const filesDirs = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js'));
        for (const file of filesDirs) {
            const command = require(`../commands/${dir}/${file}`);
            if (!command.disable) {
                client.commands.set(command.data.toJSON().name, command);
            };
        };
    };
};