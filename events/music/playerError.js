module.exports = {
    name: "playerError",
    async run(client, queue, err) {
        console.error(err);
    }
};