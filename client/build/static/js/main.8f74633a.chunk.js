(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{19:function(e,t,n){e.exports=n(46)},44:function(e,t,n){},46:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(17),s=n.n(a),c=n(3),i=n(4),l=n(5),u=n(8),p=n(6),h=n(9),b=n(18),f=n.n(b),m=n(7),d=n.n(m),v=(n(44),function(e){function t(e){var n;Object(i.a)(this,t),(n=Object(u.a)(this,Object(p.a)(t).call(this,e))).state={ready:!1,connectionAttempts:0};return function e(){d.a.get("http://localhost:5000/size").then(function(e){return n.setState(e.data)}).catch(function(t){console.error(t),n.setState({connectionAttempts:n.state.connectionAttempts+1}),n.state.connectionAttempts<3&&e()})}(),setTimeout(function(){return n.setState({ready:!0})},2500),n}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e;return e=this.state.ready&&this.state.size?o.a.createElement(O,{size:this.state.size}):this.state.connectionAttempts<3?o.a.createElement(f.a,{type:"bubbles",width:"40%"}):o.a.createElement("p",{style:{fontSize:"2em",color:"rgb(255, 127, 127)"}},"-- failed to connect to server --"),o.a.createElement("div",{className:"App"},o.a.createElement("center",null,o.a.createElement("section",{id:"grid-section"},e)))}}]),t}(r.Component)),O=function(e){function t(e){var n,r;switch(Object(i.a)(this,t),(n=Object(u.a)(this,Object(p.a)(t).call(this,e))).createTable=function(){for(var e=[],t=0;t<n.props.size;t++){for(var r=[],a=0;a<n.props.size;a++)r.push(o.a.createElement(j,{key:t+","+a+","+n.props.size,iValue:t,jValue:a,size:n.props.size,penColor:n.state.penColor,bgColor:n.state.colorArr[t][a]}));e.push(o.a.createElement("tr",{key:t+","+n.props.size},r))}return e},Math.floor(3*Math.random())){case 0:r="rgb(255, 0, 0)";break;case 1:r="rgb(0, 255, 0)";break;case 2:r="rgb(0, 0, 255)";break;default:r="rgb(127, 127, 127)"}for(var a=[],s=0;s<n.props.size;s++){a.push([]);for(var c=0;c<n.props.size;c++)a[s].push("rgb(255, 255, 255)")}return n.state={penColor:r,colorArr:a},n}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.timerID=setInterval(function(){return e.tick()},100)}},{key:"componentWillUnmount",value:function(){clearInterval(this.timerID)}},{key:"tick",value:function(){var e=this;d.a.get("http://localhost:5000/").then(function(t){return e.setState(t.data)}).catch(function(e){return console.error(e)})}},{key:"render",value:function(){return o.a.createElement("table",null,o.a.createElement("tbody",null,this.createTable()))}}]),t}(r.Component),j=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(u.a)(this,Object(p.a)(t).call(this,e))).handleMouseOver=n.handleMouseOver.bind(Object(c.a)(Object(c.a)(n))),n}return Object(h.a)(t,e),Object(l.a)(t,[{key:"handleMouseOver",value:function(){d.a.post("http://localhost:5000/space",{iValue:this.props.iValue,jValue:this.props.jValue,size:this.props.size,penColor:this.props.penColor}).then(function(e){return console.log(e)}).catch(function(e){return console.error(e)})}},{key:"render",value:function(){var e={backgroundColor:this.props.bgColor,width:80/this.props.size+"vw",height:70/this.props.size+"vh"};return o.a.createElement("td",{style:e,onMouseOver:this.handleMouseOver})}}]),t}(r.Component),k=v;s.a.render(o.a.createElement(k,null),document.getElementById("root"))}},[[19,2,1]]]);
//# sourceMappingURL=main.8f74633a.chunk.js.map