class Room {
    constructor(id, name) {
        this.numberOfBois = 0;
        this.id = id;
        this.name = name;
        this.players = {};
        this.playing = false;
    }

    newBoi(player) {
        if (this.numberOfBois == 0) {
            this.admin = player;
            this.admin.makeAdmin();
        }

        this.numberOfBois++;
        this.players[player.id] = player;
    }

    boiLeft(player) {
        this.numberOfBois--;

        delete this.players[player.id];

        // this.players.splice(this.players.indexOf(player), 1);  // TODO: create Array.prototype.remove
    }

    start() {
        console.log(`${this.admin.name} started a game in ${this.name}! (ID: ${this.id})`);
        this.playing = true;
    }
}

module.exports = Room;