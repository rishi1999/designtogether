import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import openSocket from 'socket.io-client';
import './App.css';


var serverURL = "";
var socket;

class App extends Component {
	constructor(props) {
		super(props);

		this.init = this.init.bind(this);
		this.reset = this.reset.bind(this);
		this.handlePenColorChange = this.handlePenColorChange.bind(this);

		this.state = {
			ready: false,
			connectionAttempts: 0,
			penColor: "black",
			onSplash: true
		};

		

		setTimeout(() => this.setState({onSplash: false}), 3000);
	}

	init() {
		socket = openSocket(serverURL);

		/*socket.on('error', error => {
		  // ...
		});*/

		socket.emit('size');
		socket.on('size', st => this.setState(st));

		setTimeout(() => this.setState({ready: true}), 2500);
	}

	reset() {
		this.setState({ready: false, size: null}, this.init);
	}

	handlePenColorChange(penColor) {
		this.setState({penColor: penColor});
	}

	render() {
		if (this.state.onSplash) {
			return <h1>designtogether</h1>;
		} else {
			let disp;

			if (serverURL === "") {
				disp = <ServerInput onServerSubmission={this.init}/>;
			} else if (this.state.ready && this.state.size) {
				disp = <Grid size={this.state.size} penColor={this.state.penColor} serverDownResponse={this.reset}/>;
			} else if (this.state.ready && false) {
				disp = <p style={{fontSize:"2em", color:"#ff6060"}}>-- server error --</p>;
			} else {
				disp = <ReactLoading type="bubbles" width="40%"/>;
			}

			return (
				<div className="App">
				<center>
				<section id="gridSection">
				{disp}
				</section>
				{serverURL !== "" &&
				<Palette penColor={this.state.penColor} onPenColorChange={this.handlePenColorChange}/>
			}
			</center>
			</div>
			);
		}
	}
}

class ServerInput extends Component {
	constructor(props) {
		super(props);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleKeyPress(e) {
		if (e.key === "Enter") {
			serverURL = e.target.value;
			this.props.onServerSubmission();
		}
	}

	render() {
		return (
			<React.Fragment>
			<p style={{fontSize: "4vw"}}>Enter server URL:</p>
			<input id="serverInput" type="text" onKeyPress={this.handleKeyPress}/>
			</React.Fragment>
			);
	}
}

class Grid extends Component {
	constructor(props) {
		super(props);

		socket.on('grid', st => this.setState(st));

		// initializes client-side grid to all white
		let grid = [];
		for (let i = 0; i < this.props.size; i++) {
			grid.push([]);
			for (let j = 0; j < this.props.size; j++) {
				grid[i].push("#ffffff");
			}
		}

		this.state = {
			colorArr: grid
		};
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
				children.push(<Space key={i + "," + j + "," + this.props.size} iValue={i} jValue={j} size={this.props.size} penColor={this.props.penColor} bgColor={(this.state.colorArr)[i][j]}/>);
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
		socket.emit('space', {
			iValue: this.props.iValue,
			jValue: this.props.jValue,
			penColor: this.props.penColor
		});
	}

	render() {
		const len = 70/this.props.size + "vmin";

		const tdStyle = {
			width: len,
			height: len
		};

		const spaceStyle = {
			display: "inline-block",
			backgroundColor: this.props.bgColor,
			width: "100%",
			height: "100%",
			borderRadius: "50%"
		};

		return <td style={tdStyle}><span style={spaceStyle} onMouseOver={this.handleMouseOver}/></td>;
	}
}

class Palette extends Component {
	constructor(props) {
		super(props);
		this.validateColor = this.validateColor.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	validateColor(str) {
		if (str === "") { return false; }
		if (str === "black") { return true; }
		let returnVal;
		const image = document.createElement("img");
		image.style.color = "black";
		image.style.color = str;
		returnVal = image.style.color !== "black";
		return returnVal;
	}

	handleKeyPress(e) {
		if (e.key === "Enter" && this.validateColor(e.target.value)) {
			this.props.onPenColorChange(e.target.value);
			e.target.value = "";
		}
	}

	render() {
		return (
			<React.Fragment>
			<input id="paletteInput" type="text" onKeyPress={this.handleKeyPress}/>
			<span className="palette" style={{backgroundColor: this.props.penColor}}/>
			</React.Fragment>
			);
	}
}

export default App;