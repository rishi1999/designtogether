const express = require('express');
const app = express();
const port = 3000;
var powered;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/', (req, res) => {
	res.send('Bye Bye World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));