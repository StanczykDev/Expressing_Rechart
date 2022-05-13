import { hot } from "react-hot-loader/root";
import React from "react";

import { DataPage } from "./DataPage/DataPage";

import "./App.css";

const App = () => {
    return(
      <div className="App">
        <DataPage />
      </div>
    );
}

export default hot(App);

