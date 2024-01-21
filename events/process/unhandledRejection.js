module.exports = {
    name: "unhandledRejection",
    async run(client, error) {
        console.error(error)
    }
};