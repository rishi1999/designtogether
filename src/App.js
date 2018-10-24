import React, { Component } from 'react';
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

class SizeInput extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleChange(e) {
		const val = e.target.value;
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
				console.log(this.props.size);
				children.push(<Space key={i + "," + j + "," + this.props.size} iValue={i} jValue={j} size={this.props.size}/>);
			}

			table.push(<tr>{children}</tr>)
		}

		return table;
	};
}

class Space extends Component {
	constructor(props) {
		super(props);
		const bg = "rgb(" + Math.floor(this.props.iValue / this.props.size * 255) + ", " + Math.floor(this.props.jValue / this.props.size * 255) + ", 0)";
		this.state = {
			isOn: false,
			bgColor: bg
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		if (this.state.isOn) {
			const bg = "rgb(" + Math.floor(this.props.iValue / this.props.size * 255) + ", " + Math.floor(this.props.jValue / this.props.size * 255) + ", 0)";
			this.setState(state => ({
				isOn: false,
				bgColor: bg
			}));
		} else {
			const bg = "rgb(" + (255 - Math.floor(this.props.iValue / this.props.size * 255)) + ", " + (255 - Math.floor(this.props.jValue / this.props.size * 255)) + ", 255)";
			this.setState(state => ({
				isOn: true,
				bgColor: bg
			}));
		}
	}

	render() {
		const bStyle = {
			backgroundColor: this.state.bgColor,
			width: 80/this.props.size + "vw",
			height: 70/this.props.size + "vh",
			border: "0px",
			padding: "0px",
			margin: "-0.7vh" // to remove vertical button margins
		};
		return (
			<td style={{padding: "0"}}><button style={bStyle} onMouseOver={this.handleClick}></button></td>
			);
	}
}

export default App;