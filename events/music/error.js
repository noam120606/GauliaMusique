module.exports = {
    name: "error",
    async run(client, queue, err) {
        
        console.error(err);
    }
};