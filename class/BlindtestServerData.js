const { EmbedBuilder } = require('discord.js')

module.exports = function BlindtestServerData(id) {
    this.userTab = [];
    this.expire = 0;
    this.isStop = false;
    this.tracks = [];
    this.voters = [];
    this.id = id;

    this.getId = () => {
        return this.id;
    };

    this.vote = (user) => {
        this.voters.push(user.id);
    };
    this.hasVote = (user) => {
        return this.voters.includes(user.id);
    };
    this.clearVote = () => {
        this.voters = [];
    };

    this.setTracks = (tracks) => {
        this.tracks = tracks;
    };
    this.getTracks = () => {
        return this.tracks;
    };

    this.stop = () => {
        this.isStop = true;
    }
    
    this.setExpire = (time) => {
        this.expire = time;
    };
    this.getExpire = () => {
        return this.expire;
    };

    this.appendPoint = (user) => {
        let userData = this.getUser(user);
        return (userData.points++)+1;
    };
    this.getUserPoints = (user) => {
        return this.getUser(user).points;
    };
    this.getLeaderboard = (user=undefined, allDone=false) => {
        let board = this.userTab.sort((a,b) => b.points - a.points);
        if (!allDone) return board;
        else {
            let stringDesc = user?`Tu est en position ${this.getUserPosition(user)} avec ${this.getUserPoints(user)} points\n\n`:"";
            for (let i = 0; i<(board.length>10?10:board.length); i++) {
                stringDesc+=`${i+1}) \`${board[i].user.username}\` ${board[i].points} points\n`
            }
            const embed = new EmbedBuilder()
            .setTitle("🎵 Leaderboard du blindtest")
            .setColor("#ffffff")
            .setDescription(stringDesc);
            return embed;
        }
    };
    this.getUserPosition = (user) => {
        let { points } = this.getUser(user);
        let board = this.userTab.sort((a,b) => b.points - a.points);
        i=0
        while (board[i].points>points) i++;
        return i+1;
    };

    this.getUser = (user) => {
        let userData = this.userTab.filter(data => data.user.id === user.id);
        if (userData.length < 1) {
            const defaultValues = { user, points: 0 };
            this.userTab.push(defaultValues);
            return defaultValues;
        } else {
            return userData[0];
        };
    };
};