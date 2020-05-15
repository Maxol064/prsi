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

        this.stock = [ ...require('./card-list')];  // stock = to, odkud se karty lížou
                                                    // [ ...x ] duplicates the array, otherwise push() and pop()
                                                    // will also modify the array in ./card-list.js lol
        shuffle(this.stock);

        for (let i = 0; i < 4; i++)
            for (let p in this.players)
                this.players[p].cards.push(this.stock.pop());
        
        this.discardPile = [];  // discardPile = to, kam se karty hází;  neumím pojmenovávat proměnný
        this.discardPile.push(this.stock.pop());

        console.log(this.players);
        console.log(this.stock);
        console.log(this.discardPile);
    }
}

module.exports = Room;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}