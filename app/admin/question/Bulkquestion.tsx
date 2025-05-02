"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface ExamBoard {
  _id: string;
  boardName: string;
  examName: string;
  shortName: string;
  subjects: { _id: string; subjectName: string }[];
  topics: { _id: string; topicName: string; subjectId: string }[];
}

interface Round {
  _id: string;
  roundName: string;
}

const UploadQuestionsFromWord: React.FC = () => {
  const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    axios.get("/api/examboard").then((res) => {
      setExamBoards(res.data);
    });
    axios.get("/api/round").then((res) => {
      setRounds(res.data);
    });
  }, []);

  const handleUpload = async () => {
    if (!file || !selectedTopic || !selectedSubject || !selectedRound) {
      alert("Please select all options and upload a Word file.");
      return;
    }

    const formData = new FormData();
    formData.append("wordFile", file);
    formData.append("boardId", selectedBoard);
    formData.append("examId", selectedExam);
    formData.append("subjectId", selectedSubject);
    formData.append("topicId", selectedTopic);
    formData.append("roundId", selectedRound);

    try {
      const res = await axios.post("/api/question/upload-word", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Questions uploaded successfully!");
    } catch (error) {
      alert("Failed to upload questions.");
    }
  };

  const boards = [...new Set(examBoards.map((b) => b.boardName))];
  const exams = examBoards.filter((b) => b.boardName === selectedBoard);
  const subjects = exams.find((e) => e._id === selectedExam)?.subjects || [];
  const topics = exams.find((e) => e._id === selectedExam)?.topics.filter(
    (t) => t.subjectId === selectedSubject
  ) || [];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Upload Questions (Word File)</h2>

      <div className="space-y-4">
        {/* Board */}
        <select className="w-full border p-2 rounded" onChange={(e) => {
          setSelectedBoard(e.target.value);
          setSelectedExam("");
          setSelectedSubject("");
          setSelectedTopic("");
        }}>
          <option value="">Select Board</option>
          {boards.map((board) => (
            <option key={board} value={board}>{board}</option>
          ))}
        </select>

        {/* Exam */}
        <select className="w-full border p-2 rounded" onChange={(e) => {
          setSelectedExam(e.target.value);
          setSelectedSubject("");
          setSelectedTopic("");
        }} value={selectedExam}>
          <option value="">Select Exam</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.examName}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select className="w-full border p-2 rounded" onChange={(e) => {
          setSelectedSubject(e.target.value);
          setSelectedTopic("");
        }} value={selectedSubject}>
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.subjectName}
            </option>
          ))}
        </select>

        {/* Topic */}
        <select className="w-full border p-2 rounded" onChange={(e) => setSelectedTopic(e.target.value)} value={selectedTopic}>
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.topicName}
            </option>
          ))}
        </select>

        {/* Round */}
        <select className="w-full border p-2 rounded" onChange={(e) => setSelectedRound(e.target.value)} value={selectedRound}>
          <option value="">Select Round</option>
          {rounds.map((round) => (
            <option key={round._id} value={round._id}>
              {round.roundName}
            </option>
          ))}
        </select>

        {/* Word File Upload */}
        <input type="file" accept=".doc,.docx" onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
          }
        }} className="w-full border p-2 rounded" />

        {/* Submit Button */}
        <button onClick={handleUpload} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Upload Questions
        </button>
      </div>
    </div>
  );
};

export default UploadQuestionsFromWord;
