"use client";
import React, { useState } from "react";
import AnimatedCircles from "./FrontPicture";

const FrontMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <div className="bg-[--primary]  border-t  w-full rounded-b-3xl py-5 ">
      <div className="position absolute top-5 right-5 z-10">
        {/* red dot */}
        <div className="w-1 h-1 sm:w-1 sm:h-1 rounded-full position absolute top-1 right-1 z-20 bg-red-500"></div>

        {/* notification bell  */}
        <div className="relative inline-block text-left">
          {/* SVG Button */}
          <button onClick={toggleMenu}>
            <svg
              className={`w-5 h-5 sm:w-7 sm:h-7 hover:${
                isOpen ? "fill-black" : "fill-white"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.002 17H5.606c-1.258 0-1.887 0-2.02-.098-.148-.11-.185-.174-.2-.358-.015-.164.37-.795 1.142-2.057C5.324 13.184 6 11.287 6 8.6c0-1.485.632-2.91 1.758-3.96C8.883 3.59 10.409 3 12 3c1.592 0 3.118.59 4.243 1.64C17.368 5.69 18 7.115 18 8.6c0 2.686.677 4.584 1.473 5.887.771 1.262 1.157 1.893 1.143 2.057-.017.184-.053.248-.202.358-.132.098-.761.098-2.02.098H15m-5.998 0L9 18a3 3 0 1 0 6 0v-1m-5.998 0H15"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Notification Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 p-4">
              <p className="text-sm font-semibold mb-2">Notifications</p>
              <ul className="text-sm space-y-2">
                <li>🔔 New quiz added</li>
                <li>📚 Your exam is in 2 days</li>
                <li>✅ Profile updated</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className=" flex justify-center items-center   mx-7 ">
        {/* ----- IMAGE ------ */}
        <div>
          <AnimatedCircles />
        </div>
      </div>

      <div className="flex justify-center flex-col items-center">
        <h1 className="arena text-[3.5rem]     sm:text-[8rem] sm:mt-[-1.9rem] md:text-[10rem] md:mt-[-3rem]">
          QUIZE ARENA
        </h1>
        <p className="mx-5 text-lg mt-[-1.4rem] font-semibold sm:text-[2.3rem] sm:mt-[-3rem]  md:text-[3rem] md:mt-[-3.5rem] ">
          FOR ALL GOVERNMENT EXAMS
        </p>
      </div>
    </div>
  );
};

export default FrontMobile;
