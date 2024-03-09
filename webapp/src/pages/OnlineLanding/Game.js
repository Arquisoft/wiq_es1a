module.exports = class Game {
    constructor(id) {
        this.id = id;
        this.maxPlayers = 5;
        this.rounds = 10;
        this.round = 1;
        this.players = [];
        this.answers = []
    }

    join(player) {
        this.players.push(player);
    }

    leave(player) {
        this.players.delete(player);
    }
};