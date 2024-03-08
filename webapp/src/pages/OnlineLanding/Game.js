module.exports = class Game {
    constructor(id) {
        this.id = id;
        this.maxPlayers = 5;
        this.rounds = 10;
        this.round = 1;
        this.players = new Set();
        this.answers = []
    }

    join(player) {
        //check if player is allowed to join
        if (this.status === 'open' && this.players.size < this.maxPlayers) {
            this.players.add(player);
            return true;
        }
        return false;
    }

    leave(player) {
        this.players.delete(player);
    }
};