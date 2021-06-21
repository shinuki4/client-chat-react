import React, { Component } from 'react';
//import  {ReactScrollbar} from 'react-scrollbar-js';
//import ReactScrollbar from 'react-scrollbar-js';
import logo from './logo.svg';
import './App.css';
import ChatReact from './ChatReact.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
		  test
        </p>
        <ChatReact></ChatReact>
      </div>


    );
  }
}

export default App;
