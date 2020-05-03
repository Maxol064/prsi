let socket;
let playing = false;

function preload() {
    // font = loadFont('OpenSans-Light.ttf');
}

function setup() {
    socket = io();  // io.connect(window.location.origin);

    let namebox = createInput();

    let roomButts = [];

    socket.on('roomlist', rooms => {  // rooms = [ Room { id, numberOfBois, name}, ... ]
        console.log('roomlist', rooms);

        if (playing)
            return;

        for (let butt of roomButts)
            butt.remove();

        for (let room of rooms)
            roomButts.push(createButton(`${room.name} (${room.numberOfBois})`).mouseClicked(() => {
                console.log(`joining room ${room.id} ${room.name}`);
                socket.emit('joinreq', { roomid: room.id, name: namebox.value() });
            }));
    });

    
    socket.on('joinres', roomid => {  // roomid = number
        console.log('joinres', roomid);
        playing = true;
        
        for (let butt of roomButts)
            butt.remove();  // .remove() removes the button only from th DOM, not from the roomButts (?)
        
        namebox.remove();
        
        let playerPs = [];

        socket.on('room-status', status => {  // status = Room.players { id: Player { id, name }, ... }
            console.log('room-status', status);

            for (let p of playerPs)
                p.remove();  // .remove() removes the p only from th DOM, not from the playerPs (?)

            for (let p in status)
                playerPs.push(createP(`${status[p].name} (${status[p].id})`));
        });
    });

    noCanvas();

    // createCanvas(windowWidth, windowHeight);

    // textFont(font);
    // textSize(80);
    // textAlign(CENTER, CENTER);
}

// function draw() {
//     background(100);
//     text(theTextIWantToWrite, width / 2, height / 2);
// }

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }