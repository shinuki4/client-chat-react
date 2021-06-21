const Echo = React.createClass({
	getInitialState(){
  	return { messages : [] }
  },
  componentDidMount(){
    // this is an "echo" websocket service
  	this.connection = new WebSocket('wss://echo.websocket.org');
    // listen to onmessage event
    this.connection.onmessage = evt => {
      // add the new message to state
    	this.setState({
      	messages : this.state.messages.concat([ evt.data ])
      })
    };

    // for testing purposes: sending to the echo service which will send it back back
    setInterval( _ =>{
    	this.connection.send( Math.random() )
    }, 2000 )
  },
  render: function() {
    // slice(-5) gives us the five most recent messages
    return <ul>{ this.state.messages.slice(-5).map( (msg, idx) => <li key={'msg-' + idx }>{ msg }</li> )}</ul>;
  }
});

const component = ReactDOM.render(
  <Echo />,
  document.getElementById('container')
);
