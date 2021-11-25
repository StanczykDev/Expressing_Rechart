import { hot } from "react-hot-loader/root";
import React, { useState } from "react";

import "./App.css";

const App = () => {
  const [message, setMessage] = useState("");


  const init = async () => {
    const response = await fetch("api/message", {
      method: "GET"
    });

    const message = await response.json();

    setMessage(message.text);
  }

  const getAnotherMessage = async () => {
    const response = await fetch("api/anotherMessage", {
      method: "GET"
    });

    const message = await response.json();

    setMessage(message.text);
  }

    return(
      <div className="App">
        <button onClick={init}>Send Request</button>
        <button onClick={getAnotherMessage}>Send Another Request</button>
        <h1>Hardcoded front message</h1>
        <h2>{message}</h2>
      </div>
    );
}

export default hot(App);

