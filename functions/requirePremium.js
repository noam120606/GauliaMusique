module.exports = async interaction => {
    const url = `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`;
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify({type:10,data:{}}),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}