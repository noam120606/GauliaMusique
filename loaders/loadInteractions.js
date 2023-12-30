const { readdirSync } = require('fs');

module.exports = async client => {
    let count = 0;
    const dirsInteractions = readdirSync("./interactions/");
    for (const dir of dirsInteractions) {
        const filesDirs = readdirSync(`./interactions/${dir}/`).filter(f => f.endsWith('.js'));
        for (const file of filesDirs) {
            const interaction = require(`../interactions/${dir}/${file}`);
            client.interactions.set(interaction.name, interaction);
            count++;
        };
    };
    console.log(`[startup] ${count} interactions chargé`);
};