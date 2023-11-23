module.exports = {
    name: "stats",
    async run(client, data) {
        client.pterosocket.stats = data
    }

    /* output example :
    * {
    *     cpu_absolute: 3.329,
    *     disk_bytes: 7161307200,
    *     memory_bytes: 1611730944,
    *     memory_limit_bytes: 3379200000,
    *     network: { rx_bytes: 483357768, tx_bytes: 1498516760 },
    *     state: 'running',
    *     uptime: 37901252
    * }
    */
};