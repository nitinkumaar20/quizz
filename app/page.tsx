import React from "react";
import First from "./components/Front";
import "./style.css";
import Bottom from "./components/BottomOne";
import Middle from "./components/Middle";


export default function Home() {
  return (
    <div className="home">
      <First />
        <Middle />
      <Bottom />
    </div>
  );
}
