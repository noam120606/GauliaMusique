module.exports = {
    name: "uncaughtExceptionMonitor",
    async run(client, error) {
        console.error(error)
    }
};