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
        <div className="flex flex-wrap justify-start gap-1 items-center mx-5 mt-[-1rem] text-md">
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
            <div className="w-3 h-3 bg-[--foreground]"></div>
            <h1>Unseen</h1>
          </div>
        </div>
      </div>
      <div className="mx-5 flex justify-between items-center">
        <select className="p-2 border rounded-md">
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>

        <div className=" bg-[--primary] rounded-md text-lg py-2 px-4">
          <h1>19:05</h1>
        </div>
        <div>
          <button className="border p-2 rounded-lg px-4 ">Submit</button>
        </div>
      </div>
      <div className="flex justify-center gap-2 mx-2 my-2 mt-3 ">
        <div className="text-center w-6 h-6 bg-green-500 rounded-lg">1</div>
        <div className="text-center w-6 h-6 bg-red-500 rounded-lg">2</div>
        <div className="text-center w-6 h-6 border rounded-lg ">3</div>
        <div className="text-center w-6 h-6 border rounded-lg ">5</div>
        <div className="text-center w-6 h-6 border rounded-lg ">6</div>
        <div className="text-center w-6 h-6 border rounded-lg ">7</div>
        <div className="text-center w-6 h-6 border rounded-lg ">8</div>
        <div className="text-center w-6 h-6 border rounded-lg ">9</div>
        <div className="text-center w-6 h-6 border rounded-lg ">10</div>
      </div>
      <div className="border-[2px] border-[--primary]   p-2 m-5 rounded-lg ">
        {/* questions div */}
        <div>
          <h1 className="capitalize text-2xl font-semibold">
            1.which one is the major cities of indus valley civilization.
          </h1>
        </div>

        <div className="flex flex-col mt-4 gap-2 text-lg">
          <div>
            <p className="capitalize px-3 py-1 bg-slate-300  rounded-lg hover:bg-green-500">
              harappa and mohenjo-daro
            </p>
          </div>
          <div>
            <p className="capitalize px-3 py-1 bg-slate-300  rounded-lg hover:bg-green-500">
              patliputra and varanasi
            </p>
          </div>
          <div>
            <p className="capitalize px-3 py-1 bg-slate-300  rounded-lg hover:bg-green-500">
              delhi and agra
            </p>
          </div>
          <div>
            <p className="capitalize px-3 py-1 bg-slate-300  rounded-lg hover:bg-green-500">
              taxila and nalanda
            </p>
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="flex justify-between items-center mx-5 text-lg">
        <button className="bg-[--primary]  px-5 py-2 rounded-lg font-semibold">
          Prev
        </button>
        <button className="bg-[--primary]  px-5 py-2 rounded-lg font-semibold">
          Next
        </button>
      </div>
    </div>
  );
};

export default Quiz;
