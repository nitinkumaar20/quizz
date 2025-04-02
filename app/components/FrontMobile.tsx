"use client";
import React from "react";
import AnimatedCircles from "./FrontPicture";

const FrontMobile = () => {
  return (
    <div className="bg-[--primary] border-t  w-full rounded-b-3xl py-5 ">
      <div className=" flex justify-between items-end pt-12  mx-7 " >
        <div className="">
          <h1 className="quize  text-[4rem] sm:text-[6rem]  mb-[-1.2rem] md:text-[7rem]">
            QUIZE
          </h1>
        </div>
        {/* ----- IMAGE ------ */}
        <div>
          <AnimatedCircles />
        </div>
      </div>

      <div className="flex justify-center flex-col">
        <h1 className="arena text-[7rem]  ml-5 mt-[-2.2rem]   sm:text-[10rem] sm:mt-[-4.2rem] md:text-[12rem] md:mt-[-5rem]">
          ARENA
        </h1>
        <p className="mx-5 text-2xl mt-[-2.9rem] font-bold sm:text-[2rem] sm:mt-[-3.5rem]  md:text-[2rem] md:mt-[-4.5rem] ">
          FOR ALL GOVERNMENT EXAMS
        </p>
      </div>
    </div>
  );
};

export default FrontMobile;
