const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const port = 5000;

const corsOptions = {
	origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(bodyParser.json());
app.use(cors(corsOptions));

var grid = [];
init(10); //needs to be set to DEFAULT_SIZE

app.get('/', (req, res) => {
	res.send({
		"colorArr": grid
	});
});

app.post('/space', (req, res) => {
	if (req.body.size != grid.length) {
		init(req.body.size);
		res.send("grid size changed");
	} else {
		grid[req.body.iValue][req.body.jValue] = req.body.penColor;
		res.send("(" + req.body.iValue + ", " + req.body.jValue + ") updated");
	}
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

function init(size) {
	for (let i = 0; i < size; i++) {
		grid.push([]);
		for (let j = 0; j < size; j++) {
			grid[i].push("rgb(255, 255, 255)");
		}
	}
}