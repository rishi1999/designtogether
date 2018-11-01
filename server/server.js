const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

var grid = [];
var size = 20;
if (process.argv.length == 3) {
	size = process.argv[2];
}
init();

app.get('/size', (req, res) => {
	res.send({
		"size": size
	});
});

app.get('/', (req, res) => {
	res.send({
		"colorArr": grid
	});
});

app.post('/space', (req, res) => {
	grid[req.body.iValue][req.body.jValue] = req.body.penColor;
	res.send("(" + req.body.iValue + ", " + req.body.jValue + ") updated");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

function init() {
	for (let i = 0; i < size; i++) {
		grid.push([]);
		for (let j = 0; j < size; j++) {
			grid[i].push("rgb(255, 255, 255)");
		}
	}
}