import React from "react";
import MobileQz from "./components/MobileQz";
import DesktopQz from "./components/DesktopQz";

const Quiz = () => {
  return (
    <div>
      <div className="hidden lg:block">
        <DesktopQz />
      </div>
      <div className="block lg:hidden">
        <MobileQz />
      </div>
    </div>
  );
};

export default Quiz;
