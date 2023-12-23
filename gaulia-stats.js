const baseUrl = "http://gaulia-stats.noam120606.fr:20045/api";

module.exports = function Stats(apiKey, dev) {
    this.key = apiKey;
    this.dev = dev;

    this.postCommand = commandName => {
        if (this.dev) return {error: "dev environement"};
        try {
            fetch(baseUrl + "/command" + this._genParms([`name=${commandName}`]), {}).then(async data => {
                return await data.json();
            });
        } catch(error) {
            return { error };
        };
    },
    this.postEvent = eventName => {
        if (this.dev) return {error: "dev environement"};
        try {
            fetch(baseUrl + "/event" + this._genParms([`name=${eventName}`]), {}).then(async data => {
                return await data.json();
            });
        } catch(error) {
            return { error };
        };
    },
    this.postGlobalStats = (guilds, users) => {
        if (this.dev) return {error: "dev environement"};
        try {
            fetch(baseUrl + "/globalstats" + this._genParms([`guilds=${guilds}`, `users=${users}`]), {}).then(async data => {
                return await data.json();
            });
        } catch(error) {
            return { error };
        };
    },
    this.postVote = () => {
        if (this.dev) return {error: "dev environement"};
        try {
            fetch(baseUrl + "/vote" + `?key=${this.apiKey}`, {}).then(async data => {
                return await data.json();
            });
        } catch(error) {
            return { error };
        };
    }

    this._genParms = parms => {
        parms.push(`key=${this.apiKey}`);
        return "?"+parms.join('&');
    }
}
