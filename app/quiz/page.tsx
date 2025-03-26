import React from "react";

const Quiz = () => {
  return (
    <div>
      <div className="m-5 rounded-lg w-[90%]  bg-[--primary]">
        <div className="m-5 flex gap-5">
          <div className="flex  justify-center items-center gap-1">
            <div className="w-3 h-3 bg-green-500"></div>
            <h1>2</h1>
          </div>

          <div className="flex justify-center items-center gap-1">
            <div className="w-3 h-3 bg-red-500"></div>
            <h1>1</h1>
          </div>

          <div className="flex justify-center items-center gap-1">
            <div className="w-3 h-3 bg-white"></div>
            <h1>5</h1>
          </div>
        </div>
        <div className="flex flex-wrap justify-start gap-1 items-center mx-5 mt-[-1rem]">
  {/* Top Row */}
  <div className="flex justify-center items-center gap-2 ">
    <div className="w-3 h-3 bg-green-500"></div>
    <h1>Attempted</h1>
  </div>
  <div className="flex justify-center items-center gap-2 ">
    <div className="w-3 h-3 bg-red-500"></div>
    <h1>Not Attempted</h1>
  </div>

  {/* Bottom Row */}
  <div className="flex justify-start items-center gap-2 w-full mt-[-.8rem] ">
    <div className="w-3 h-3 bg-white"></div>
    <h1>Unseen</h1>
  </div>
</div>

      </div>
      <div className="mx-5 flex justify-between items-center">
      <select className="p-2 border rounded-md">
  <option value="en">English</option>
  <option value="hi">Hindi</option>
</select>

<div className=" bg-[--primary] rounded-md text-lg py-2 px-4"><h1>19:05</h1></div>
<div>
  <button className="border p-2 rounded-lg px-4 ">Submit</button>
</div>

      </div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
    </div>
  );
};

export default Quiz;
