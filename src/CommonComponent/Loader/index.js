import React, { useEffect } from "react";
import $ from "jquery";

import Lottie from "react-lottie-player";
import * as animationData from "./loader.json";
import "./style.css";

const Loader = () => {
  useEffect(() => {
    $("body").addClass("loading");
    return () => {
      $("body").removeClass("loading");
    };
  }, []);

  return (
    <div className="loadingPanel d-flex align-items-center lottie">
      <Lottie
        loop
        animationData={animationData}
        play
        style={{ width: 150, height: 150, margin: "0 auto" }}
      />
    </div>
  );
};

export default Loader;
