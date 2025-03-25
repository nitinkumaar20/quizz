"use client";
import React from "react";
import AnimatedCircles from "./FrontPicture";

const Front = () => {

  return (
    <div className="bg-[--primary] border-t h-[20rem] w-full rounded-b-3xl">
  
<div className=" flex justify-center items-end pt-12">
  <div>
    <h1 className="quize mr-7 text-4xl">QUIZE</h1>
  </div>
  {/* ----- IMAGE ------ */}

<AnimatedCircles/>
</div>

<div className="flex justify-center flex-col">
  <h1 className="arena text-[3rem]  ml-3 mt-[-1rem]">ARENA</h1>
  <p className="mx-3 text-lg mt-[-1rem] font-bold">FOR ALL GOVERNMENT EXAMS</p>
</div>
   
    </div>
  );
};

export default Front;
