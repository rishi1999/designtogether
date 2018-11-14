import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ready: false,
			connectionAttempts: 0
		};

		const connect = () => {
			axios.get('http://localhost:5000/size' /*'https://lazy-lion-18.localtunnel.me'*/)
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

	render() {
		let disp;

		if (this.state.ready && this.state.size) {
			disp = <Grid size={this.state.size}/>;
		} else if (this.state.connectionAttempts < 3) {
			disp = <ReactLoading type="bubbles" width="40%"/>;
		} else {
			disp = <p style={{fontSize:"2em", color:"rgb(255, 127, 127)"}}>-- failed to connect to server --</p>;
		}

		return (
			<div className="App">
			<center>
			<section id="grid-section">
			{disp}
			</section>
			<Palette/>
			</center>
			</div>
			);
	}
}

class Grid extends Component {
	constructor(props) {
		super(props);

		// chooses random pen color for user
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

		// initializes client-side grid to all white
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

class Palette extends Component {
	constructor(props) {
		super(props);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleKeyPress(e) {
		e.preventDefault();
		if (e.key === "Enter") {
			alert('hi');
			// TODO do color changing stuff here
		}
	}

	render() {
		return <input type="text" onKeyPress={this.handleKeyPress}/>;
	}
}

export default App;