import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

var DEFAULT_SIZE = 10;
var MAX_SIZE = 25;

class App extends Component {
	constructor(props) {
		super(props);
		this.handleSizeChange = this.handleSizeChange.bind(this);
		this.state = {size: DEFAULT_SIZE};
	}

	handleSizeChange(val) {
		this.setState(
			{size: val}
			);
	}

	render() {
		return (
			<div className="App">
			<center>
			<section id="size-input-section">
			<SizeInput size={this.state.size} onSizeChange={this.handleSizeChange}/>
			</section>
			<section id="grid-section">
			<Grid size={this.state.size}/>
			</section>
			</center>
			</div>
			);
	}
}

class SizeInput extends React.Component { // TODO size changes aren't preserved on server. refreshing client resets size back to 10.
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleChange(e) {
		const val = e.target.value;
		// eslint-disable-next-line
		if (val == 0) {
			this.props.onSizeChange("");
		}
		else if (!(isNaN(val))) {
			this.props.onSizeChange(Math.min(val, MAX_SIZE));
		}
	}

	handleFocus(e) {
		this.props.onSizeChange("");
	}

	handleBlur(e) {
		// eslint-disable-next-line
		if (this.props.size == 0) {
			this.props.onSizeChange(DEFAULT_SIZE);
		}
	}

	render() {
		return (
			<input type="text" value={this.props.size} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
			);
	}
}

class Grid extends Component {
	constructor(props) {
		super(props);

		const colorIndex = Math.floor(Math.random() * 3);
		let penColor;
		switch(colorIndex) {
			case 0:
			penColor = "rgb(255, 0, 0)";
			break;
			case 1:
			penColor = "rgb(0, 255, 0)";
			break;
			case 2:
			penColor = "rgb(0, 0, 255)";
			break;
			default:
			penColor = "rgb(127, 127, 127)";
		}

		let grid = [];
		for (let i = 0; i < this.props.size; i++) {
			grid.push([]);
			for (let j = 0; j < this.props.size; j++) {
				grid[i].push("rgb(255, 255, 255)");
			}
		}

		this.state = {
			penColor: penColor,
			colorArr: grid
		};
	}

	componentDidMount() {
		this.timerID = setInterval(
			() => this.tick(),
			100
			);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	tick() {
		axios.get('http://localhost:5000/' /*'https://lazy-lion-18.localtunnel.me'*/)
		.then(response => this.setState(response.data))
		.catch(error => console.error(error));
	}

	render() {
		return (
			<table>
			<tbody>
			{this.createTable()}
			</tbody>
			</table>
			);
	}

	createTable = () => {
		let table = [];

		for (let i = 0; i < this.props.size; i++) {
			let children = [];

			for (let j = 0; j < this.props.size; j++) {
				children.push(<Space key={i + "," + j + "," + this.props.size} iValue={i} jValue={j} size={this.props.size} penColor={this.state.penColor} bgColor={(this.state.colorArr)[i][j]}/>);
			}

			table.push(<tr key={i + "," + this.props.size}>{children}</tr>)
		}

		return table;
	};
}

class Space extends Component {
	constructor(props) {
		super(props);
		this.handleMouseOver = this.handleMouseOver.bind(this);
	}



	handleMouseOver() {
		axios.post('http://localhost:5000/space' /*'https://lazy-lion-18.localtunnel.me/space'*/, {
			iValue: this.props.iValue,
			jValue: this.props.jValue,
			size: this.props.size,
			penColor: this.props.penColor
		})
		.then(response => console.log(response))
		.catch(error => console.error(error));
	}

	render() {
		const cStyle = {
			backgroundColor: this.props.bgColor,
			width: 80/this.props.size + "vw",
			height: 70/this.props.size + "vh"
		};
		return <td style={cStyle} onMouseOver={this.handleMouseOver}></td>;
	}
}

export default App;