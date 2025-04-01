import React from "react";
import FrontMobile from "./components/FrontMobile";
import "./style.css";
import FooterMobile from "./components/FooterMobile";
import Middle from "./components/Middle";
import FooterDesktop from "./components/FooterDesktop";
import FrontDesktop from "./components/FrontDesktop";

export default function Home() {
  return (
    <div className="home">
      <div>
        <div className="block lg:hidden">
          <FrontMobile />
          <FooterMobile />
        </div>
        <Middle />
        <div className="hidden lg:block">
          <FrontDesktop/>
          <FooterDesktop />
        </div>
      </div>
    </div>
  );
}
