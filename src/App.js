import React, { Component } from "react";
import axios from "axios";

import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      password: ""
    };
  }

  sendCredentials = () => {
    const settara = 4;
    const options = {
      headers: {
        token: "12344555"
      }
    };
    const obj = {
      user: this.state.user,
      password: this.state.password
    };
    const promise = axios.post(
      `http://localhost:7000/login/${settara}?hilal=aissani`,
      obj,
      options
    );
    promise
      .then(respond => {
        console.log(respond);
      })
      .catch(err => {
        console.log(err);
      });
  };
  eventHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="App">
        <h1>InfoSys is here </h1>
        User:
        <input
          placeholder="User Name"
          name="user"
          value={this.state.user}
          onChange={this.eventHandler}
        />
        password:
        <input
          placeholder="Pass Word"
          name="password"
          value={this.state.password}
          onChange={this.eventHandler}
        />
        <button onClick={this.sendCredentials}>Submit</button>
      </div>
    );
  }
}

export default App;
