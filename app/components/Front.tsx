"use client";
import React, { useEffect, useState } from "react";
import Bottom from "./BottomOne";

const Front = () => {
  const [animate, setAnimate] = useState(false);
  const [category, setCategory] = useState("");

  const categories = [
    { value: "ssc", label: "SSC Exams" },
    { value: "banking", label: "Banking Exams" },
    { value: "railway", label: "Railway Exams" },
  ];
  useEffect(() => {
    setAnimate(true);
  }, []);
  return (
    <div>
      <div className="frontMain bg-purple-500 rounded-b-3xl  h-[20rem] w-full py-5 gap-5">
        <div className="  flex justify-center items-center">
          {/* <div className="frontImage bg-blue-400 rounded-xl  h-15 w-15"></div>  */}
          {/* image div -------------------------*/}
          <div className="relative flex items-center justify-center ">
            {/* Main Box */}
            <div className="frontImage bg-blue-400 rounded-xl h-40 w-40 shadow-lg relative">
              {/* Floating Box - Left Top */}
              <div
                className={`absolute top-[8px] left-[-20px] h-7 w-7 bg-purple-300 rounded-md shadow-md transition-transform duration-1000 ${
                  animate
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-10 opacity-0"
                }`}
              ></div>

              {/* Floating Box - Right Bottom */}
              <div
                className={`absolute bottom-[8px] right-[-20px] h-7 w-7 bg-purple-300 rounded-md shadow-md transition-transform duration-1000 ${
                  animate
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}
              ></div>
            </div>
          </div>

          {/* image div -------------------------*/}
        </div>
        <div className=" flex justify-center items-center flex-col">
          <h1 className="font-semibold text-3xl top-1 relative">
            1000+ PYQ QUIZE
          </h1>
          <h1 className="font-bold ">FOR GOVERNMENT EXAMS</h1>
        </div>
      </div>

      <div className="h-[100rem] ">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1>Select a Quiz</h1>

        <div className="flex flex-col space-y-4 ">
          {/* <label className="text-lg font-semibold">Select a Category:</label> */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pr-24 py-2 border rounded-md "
          >
            <option value="" disabled className="px-10 py-2 ">
              Select an option
            </option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* {category && <p className="text-blue-600">Selected: {category}</p>} */}
        </div>
        </div>
      </div>

      <Bottom />
    </div>
  );
};

export default Front;
