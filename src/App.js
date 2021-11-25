import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "./App.css";

class App extends Component{
  componentDidMount() {
    this.init();
  }

  init = async () => {
    const response = await fetch("api", {
      method: "GET"
    });

    const message = await response.json();

    console.log(message.text);
  }

  render(){
    return(
      <div className="App">
        <button onClick={this.init}>Send Request</button>
        <h1> Hardcoded front message </h1>
      </div>
    );
  }
}

export default hot(module)(App);