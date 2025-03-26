"use client";
import React from "react";
import AnimatedCircles from "./FrontPicture";

const Front = () => {

  return (
    <div className="bg-[--primary] border-t h-[20rem] w-full rounded-b-3xl">
  
<div className=" flex justify-between items-end pt-12  mx-7">
  <div className="">
    <h1 className="quize  text-[3rem] mb-[-1.2rem]">QUIZE</h1>
  </div>
  {/* ----- IMAGE ------ */}
<div>

<AnimatedCircles/>
</div>
</div>

<div className="flex justify-center flex-col">
  <h1 className="arena text-[5.5rem]  ml-5 mt-[-1.5rem]">ARENA</h1>
  <p className="mx-5 text-lg mt-[-2.3rem] font-bold">FOR ALL GOVERNMENT EXAMS</p>
</div>
   
    </div>
  );
};

export default Front;
