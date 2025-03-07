"use client";
import React, { useEffect, useState } from "react";
// import Bottom from "./BottomOne";


interface ExamData {
  [exam: string]: {
    logo: string;
    types: {
      [examType: string]: {
        subjects: string[];
        topics: { [subject: string]: string[] };
        questions: { [topic: string]: { question: string; duration: string }[] };
      };
    };
  };
}

const data: ExamData = {
  "SSC": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Staff_Selection_Commission_Logo.jpg",
    types: {
      "CGL": {
        subjects: ["Maths", "Reasoning", "English"],
        topics: {
          "English": ["Subject-Verb Agreement", "Adjective", "Para Jumbles"],
        },
        questions: {
          "Adjective": Array(20).fill({ question: "What is an adjective?", duration: "20min" }),
        }
      }
    }
  },
  "Railway": {
    logo: "https://logos-download.com/wp-content/uploads/2019/11/Indian_Railway_Logo_1.png",
    types: {
      "NTPC": {
        subjects: ["Maths", "General Intelligence", "General Awareness"],
        topics: {
          "Maths": ["Algebra", "Geometry"],
        },
        questions: {
          "Algebra": Array(20).fill({ question: "Solve x+2=5", duration: "20min" }),
        }
      }
    }
  }
};

const Front = () => {
  const [animate, setAnimate] = useState(false);

  const getFirstValidDetail = (exam: string) => Object.keys(data[exam].types)[0] || "";

  const [selectedExam, setSelectedExam] = useState<string>("SSC");
  const [selectedDetail, setSelectedDetail] = useState<string>(getFirstValidDetail("SSC"));
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const handleExamChange = (exam: string) => {
    const firstDetail = getFirstValidDetail(exam);
    setSelectedExam(exam);
    setSelectedDetail(firstDetail);
    setSelectedSubject("");
    setSelectedTopic("");
  };

  const handleDetailChange = (detail: string) => {
    setSelectedDetail(detail);
    setSelectedSubject("");
    setSelectedTopic("");
  };

  const getMixedQuestions = () => {
    let mixedQuestions: { question: string; duration: string }[] = [];
    Object.keys(data).forEach((exam) => {
      Object.keys(data[exam].types).forEach((detail) => {
        Object.keys(data[exam].types[detail].questions).forEach((topic) => {
          mixedQuestions = mixedQuestions.concat(data[exam].types[detail].questions[topic]);
        });
      });
    });
    return mixedQuestions;
  };

  const showMixedQuestions = !selectedExam || !selectedDetail || !selectedSubject || !selectedTopic;
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

    
        <div className="p-4 space-y-4">
      {/* {selectedExam && <img src={data[selectedExam].logo} alt={selectedExam} className="h-16 w-16" />} */}

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <select onChange={(e) => handleExamChange(e.target.value)} className="border p-2 w-full" value={selectedExam}>
          <option value="">Select Exam</option>
          {Object.keys(data).map((exam) => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>

        <select onChange={(e) => handleDetailChange(e.target.value)} className="border p-2 w-full" value={selectedDetail}>
          <option value="">Select Exam Type</option>
          {Object.keys(data[selectedExam]?.types || {}).map((detail) => (
            <option key={detail} value={detail}>{detail}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedSubject(e.target.value)} className="border p-2 w-full" value={selectedSubject}>
          <option value="">Select Subject</option>
          {data[selectedExam]?.types[selectedDetail]?.subjects?.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedTopic(e.target.value)} className="border p-2 w-full" value={selectedTopic}>
          <option value="">Mix Questions</option>
          {data[selectedExam]?.types[selectedDetail]?.topics?.[selectedSubject]?.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      {/* Question Display */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {(showMixedQuestions ? getMixedQuestions() : data[selectedExam]?.types[selectedDetail]?.questions[selectedTopic])?.map((q, index) => (
          <div key={index} className="border p-4 text-center">
             {selectedExam && <img src={data[selectedExam].logo} alt={selectedExam} className="h-16 w-16" />}
            <h1>{selectedSubject || "Mixed Topics"} - {selectedTopic || "General Quiz"}</h1>
            <h2>Total Questions: 20</h2>
            <h3>Duration: 20min</h3>
            <p>{q.question}</p>
          </div>
        ))}
      </div>
    </div>



        </div>
      </div>

      {/* <Bottom /> */}
    </div>
  );
};

export default Front;
