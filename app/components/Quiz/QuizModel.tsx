"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface QuizStartModalProps {
  setIsOpen: (open: boolean) => void;
  topic : string;
   time : number;
   question : number;
}
const QuizStartModel = ({ setIsOpen, topic, time, question }: QuizStartModalProps) => {
  const router = useRouter();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
        <p>
          <strong>Topic:</strong> {topic}
        </p>
        <p>
          <strong>Time:</strong> {time} minutes
        </p>
        <p>
          <strong>Questions:</strong> {question}
        </p>

        <div className="mt-4 flex justify-around">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-[--fivth] text-white px-4 py-2 rounded-lg"
            onClick={() => router.push("/quiz")}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizStartModel;
