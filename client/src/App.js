import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';
import './App.css';

var serverURL = ""; /* http://localhost:5000 */

class App extends Component {
	constructor(props) {
		super(props);
		this.init = this.init.bind(this);
		this.reset = this.reset.bind(this);
		this.handlePenColorChange = this.handlePenColorChange.bind(this);
		this.state = {
			ready: false,
			connectionAttempts: 0,
			penColor: "black"
		};
	}

	init() {
		const connect = () => {
			axios.get(serverURL + '/size')
			.then(response => this.setState(response.data))
			.catch(error => {
				console.error(error);
				this.setState({connectionAttempts: this.state.connectionAttempts + 1});
				if (this.state.connectionAttempts < 3) {
					connect();
				}
			});
		};

		connect();

		setTimeout(
			() => this.setState({ready: true}),
			2500
			);
	}

	reset() {
		this.setState({ready: false, connectionAttempts: 0}, this.init);
	}

	handlePenColorChange(penColor) {
		this.setState({penColor: penColor});
	}

	render() {
		let disp;

		if (serverURL === "") {
			disp = <ServerInput onServerSubmission={this.init}/>;
		} else if (this.state.ready && this.state.size) {
			disp = <Grid size={this.state.size} penColor={this.state.penColor} serverDownResponse={this.reset}/>;
		} else if (this.state.connectionAttempts < 3) {
			disp = <ReactLoading type="bubbles" width="40%"/>;
		} else {
			disp = <p style={{fontSize:"2em", color:"#ff7f7f"}}>-- failed to connect to server --</p>;
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
		axios.get(serverURL)
		.then(response => this.setState(response.data))
		.catch(error => {
			if (this.timerID !== null) {
				clearInterval(this.timerID);
				this.timerID = null;
				this.props.serverDownResponse();
			}
		});
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
		axios.post(serverURL + '/space', {
			iValue: this.props.iValue,
			jValue: this.props.jValue,
			size: this.props.size,
			penColor: this.props.penColor
		})
		.then(response => {} /*console.log(response)*/)
		.catch(error => {} /*console.error(error)*/);
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
		// image.parentNode.removeChild(image);
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
			<span className="dot" style={{backgroundColor: this.props.penColor}}/>
			</React.Fragment>
			);
	}
}

export default App;