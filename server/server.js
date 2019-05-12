// load dependencies

const app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const ngrok = require('ngrok');
const port = 5000;

const cors = require('cors');
app.use(cors);


// grid setup

var grid = [];
var size = 20;

if (process.argv.length == 3) {
	size = process.argv[2];
}

for (let i = 0; i < size; i++) {
	grid.push([]);
	for (let j = 0; j < size; j++) {
		grid[i].push("rgb(255, 255, 255)");
	}
}


// server setup

http.listen(port, () => console.log(`Server listening on port ${port}.`));

(async () => {
	try {
		const url = await ngrok.connect(port);
		console.log(`Server live at ${url}.`);
	} catch (err) {
		console.error('ERROR: Server failed to connect to ngrok!');
		console.error(err);
	}
})();


// client interaction

setInterval(() => {
	io.emit('grid', {
		"colorArr": grid
	});
}, 200);

io.on('connection', client => {
	console.log('a user joined the room');

	client.on('disconnect', () => {
    	console.log('a user left the room');
  	});

	client.join('default room');

	client.on('size', () => {
		client.emit('size', {
			"size": size
		});
	});

	client.on('space', st => {
		grid[st.iValue][st.jValue] = st.penColor;
	})
});