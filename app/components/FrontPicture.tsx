import React from "react";
import Image from "next/image";
const AnimatedCircles = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Main Circle */}
      <div className="w-36 h-36  bg-center">
        <Image
          src="https://lh3.googleusercontent.com/d/1Px6edZckEg5s8SwTJZtmNvQ_4f_izd4t=s220?authuser=0"
          alt="Google Drive Image"
          width={140}
          height={140}
          layout="responsive"
        />
      </div>

      {/* Small Circles with Orbit Animation */}
      <div className="absolute w-6 h-6 bg-blue-500 rounded-full transition-all top-[-.5rem] right-3 shadow-md "></div>
      <div className="absolute w-6 h-6 bg-orange-500 rounded-full top-9 right-32 shadow-md"></div>
      <div className="absolute w-6 h-6 bg-[--tertiary] rounded-full  top-32 left-24 shadow-md"></div>
    </div>
  );
};

export default AnimatedCircles;
