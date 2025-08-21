import React, { Component } from "react";
import * as animationData from "./ConnectionLost";
import Lottie from "react-lottie-player";

export default class ConnectionLost extends Component {
  render() {
    return (
      <div>
        <Lottie
          loop
          animationData={animationData}
          play
          style={{ height: 400, width: 320, margin: "0 auto" }}
        />
      </div>
    );
  }
}
