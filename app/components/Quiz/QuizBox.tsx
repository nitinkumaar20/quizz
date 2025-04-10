"use client";
import React, { useState } from "react";
import QuizStartModel from "./QuizModel";

type contentType = {
  title: string;
  questions: number;
  duration: number;
};

const QuizBox = ({ title, questions, duration }: contentType) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" ">
      <div className="  bg-slate-200 rounded-lg h-52 text-[--font-color]  ">
        <div className="bg-[--primary] rounded-b-lg  rounded-t-lg w-full h-[28%] flex justify-center items-center ">
          <img
            className="w-16 h-12"
            src="https://lh3.googleusercontent.com/d/1Hm3Ul9kmn0_cIagSTCUtvCohx4MgZG7j=s220?authuser=0"
            alt="error"
          />
        </div>
        <div className="flex justify-center items-center px-2 py-1">
          <h1 className="capitalize overflow-hidden leading-5">
            {title.slice(0, 25)}...
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center  h-14 px-5">
          <div className="flex justify-between items-center gap-5 ">
            <div className="flex justify-between items-center ">
              <div>
                <svg
                  className="w-5 h-5 fill-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22Zm0-14.25c-.621 0-1.125.504-1.125 1.125a.75.75 0 0 1-1.5 0 2.625 2.625 0 1 1 4.508 1.829c-.092.095-.18.183-.264.267-.216.215-.405.404-.571.617-.22.282-.298.489-.298.662V13a.75.75 0 0 1-1.5 0v-.75c0-.655.305-1.186.614-1.583.229-.294.516-.58.75-.814.07-.07.136-.135.193-.194A1.125 1.125 0 0 0 12 7.75ZM12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  />
                </svg>
              </div>
              <div>
                <p>Questions</p>
              </div>
            </div>
            <div>
              <p className="truncate">{questions}</p>
            </div>
          </div>

          <div className="flex justify-between items-center  gap-7">
            <div className="flex justify-between items-center">
              <div>
                <svg
                  className="w-5 h-5 fill-black"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g data-name="Layer 2">
                    <path
                      fill="none"
                      d="M0 0h48v48H0z"
                      data-name="invisible box"
                    />
                    <path
                      d="m38.8 15.1 2.4-2.5a1.9 1.9 0 0 0 0-2.8 1.8 1.8 0 0 0-1.4-.6 2 2 0 0 0-1.4.6l-2.5 2.4A19.1 19.1 0 0 0 26 8.1V6h2a2 2 0 0 0 0-4h-8a2 2 0 0 0 0 4h2v2.1a19 19 0 1 0 16.8 7ZM39 27H24V12a15 15 0 0 1 15 15Z"
                      data-name="Q3 icons"
                    />
                  </g>
                </svg>
              </div>
              <div>
                <p className=""> Duration</p>
              </div>
            </div>
            <div>
              <p> {duration}</p>
            </div>
          </div>
        </div>

        <div className="text-center pb-2 py-2">
          {/* <button className="bg-[--secondary] rounded-xl px-7 py-1 ">
            Start
          </button> */}

          <button
            className="bg-[--secondary] rounded-xl px-7 py-1"
            onClick={() => setIsOpen(true)}
          >
            Start
          </button>

          {/* Show Modal if isOpen is true */}
          {isOpen && <QuizStartModel setIsOpen={setIsOpen} topic={title} question={questions} time={duration} />}

          {/* {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
            <p><strong>Topic:</strong> General Knowledge</p>
            <p><strong>Time:</strong> 10 minutes</p>
            <p><strong>Questions:</strong> 20</p>

            <div className="mt-4 flex justify-around">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => router.push("/quiz")}
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )} */}
        </div>
      </div>
    </div>
  );
};

export default QuizBox;
