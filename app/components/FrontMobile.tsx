"use client";
import React from "react";
import AnimatedCircles from "./FrontPicture";

const FrontMobile = () => {
  return (
    <div className="bg-[--primary] border-t  w-full rounded-b-3xl py-5">
      <div className=" flex justify-between items-end pt-12  mx-7">
        <div className="">
          <h1 className="quize  text-[3rem] sm:text-[5rem]  mb-[-1.2rem] ">
            QUIZE
          </h1>
        </div>
        {/* ----- IMAGE ------ */}
        <div>
          <AnimatedCircles />
        </div>
      </div>

      <div className="flex justify-center flex-col">
        <h1 className="arena text-[5.5rem]  ml-5 mt-[-1.5rem]  sm:text-[6rem] md:text-[8rem] md:mt-[-3rem]">
          ARENA
        </h1>
        <p className="mx-5 text-lg mt-[-2.3rem] font-bold sm:text-[1rem] md:text-[2rem] md:mt-[-3rem] ">
          FOR ALL GOVERNMENT EXAMS
        </p>
      </div>
    </div>
  );
};

export default FrontMobile;
