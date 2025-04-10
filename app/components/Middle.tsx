"use client";
import React from "react";
import QuizBox from "./Quiz/QuizBox";

// interface ExamData {
//   [exam: string]: {
//     logo: string;
//     types: {
//       [examType: string]: {
//         subjects: string[];
//         topics: { [subject: string]: string[] };
//         questions: { [topic: string]: { question: string; duration: string }[] };
//       };
//     };
//   };
// }

// const data: ExamData = {
//   "SSC": {
//     logo: "https://lh3.googleusercontent.com/d/1Hm3Ul9kmn0_cIagSTCUtvCohx4MgZG7j=s220?authuser=0",
//     types: {
//       "CGL": {
//         subjects: ["Maths", "Reasoning", "English"],
//         topics: {
//           "English": ["Subject-Verb Agreement", "Adjective", "Para Jumbles"],
//         },
//         questions: {
//           "Adjective": Array(20).fill({ question: "What is an adjective?", duration: "20min" }),
//         }
//       }
//     }
//   },
//   "Railway": {
//     logo: "https://logos-download.com/wp-content/uploads/2019/11/Indian_Railway_Logo_1.png",
//     types: {
//       "NTPC": {
//         subjects: ["Maths", "General Intelligence", "General Awareness"],
//         topics: {
//           "Maths": ["Algebra", "Geometry"],
//         },
//         questions: {
//           "Algebra": Array(20).fill({ question: "Solve x+2=5", duration: "20min" }),
//         }
//       }
//     }
//   }
// };

const Middle = () => {
  return (
    <div className=" py-10 ">
      <div className="grid grid-cols-2 mx-4 gap-2 font-bold  border-b-2 pb-5 text-[--font-color]">
        <select name="" id="" className="p-2 border rounded-md">
          <option value="">SSC</option>
          <option value="">Railways</option>
          <option value="">Banking</option>
        </select>

        <select name="" id="" className="p-2 border rounded-md capitalize">
          <option value="">Cgl</option>
          <option value="">chsl</option>
          <option value="">cpo</option>
        </select>

        <select name="" id="" className="p-2 border rounded-md">
          <option value="">English</option>
          <option value="">Maths</option>
          <option value="">Reasoning</option>
        </select>

        <select name="" id="" className="p-2 border rounded-md">
          <option value="">Subject verb aggrement</option>
          <option value="">Adjective</option>
          <option value="">Question Tag</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3 p-3">
        <QuizBox
          title="Indus Valley civilization"
          questions={20}
          duration={20}
        />
        <QuizBox title="mugal empire 3" questions={20} duration={20} />
        <QuizBox title="mugal empire 2" questions={50} duration={10} />
        <QuizBox title="mugal empire 5" questions={10} duration={20} />
        <QuizBox title="mugal empire 6" questions={60} duration={50} />
        <QuizBox title="mugal empire 1" questions={20} duration={20} />
      </div>
    </div>
  );
};

export default Middle;
