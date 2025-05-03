import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface ParsedQuestion {
  questionText: string;
  questionTitle: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  answerCorrect: string;
  questionYear: string;
}

interface FinalQuestion extends ParsedQuestion {
  topicId: number;
  roundId: number;
  active: boolean;
}

export default function BulkQuestionUploader() {
  const [examBoards, setExamBoards] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [rounds, setRounds] = useState<any[]>([]);
  const [questions, setQuestions] = useState<FinalQuestion[]>([]);

  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedRound, setSelectedRound] = useState("");

  useEffect(() => {
    fetch("http://localhost:1100/api/examboard").then(res => res.json()).then(setExamBoards);
    fetch("http://localhost:1100/api/subject").then(res => res.json()).then(setSubjects);
    fetch("http://localhost:1100/api/topic").then(res => res.json()).then(setTopics);
    fetch("http://localhost:1100/api/round").then(res => res.json()).then(setRounds);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw: ParsedQuestion[] = XLSX.utils.sheet_to_json(sheet);

      const enriched: FinalQuestion[] = raw.map((item) => ({
        ...item,
        topicId: parseInt(selectedTopic),
        roundId: parseInt(selectedRound),
        active: true,
      }));

      setQuestions(enriched);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Bulk Question Upload</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <select className="p-2 border rounded" onChange={(e) => setSelectedBoard(e.target.value)} value={selectedBoard}>
          <option value="">Select Board</option>
          {examBoards.map((eb) => (
            <option key={eb.id} value={eb.id}>{eb.boardName}</option>
          ))}
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSelectedExam(e.target.value)} value={selectedExam}>
          <option value="">Select Exam</option>
          {examBoards
            .filter((eb) => eb.id === selectedBoard)
            .flatMap((eb) => eb.exams || [])
            .map((ex: any) => (
              <option key={ex.id} value={ex.id}>{ex.examName}</option>
            ))}
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSelectedSubject(e.target.value)} value={selectedSubject}>
          <option value="">Select Subject</option>
          {subjects.map((subj) => (
            <option key={subj.id} value={subj.id}>{subj.name}</option>
          ))}
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSelectedTopic(e.target.value)} value={selectedTopic}>
          <option value="">Select Topic</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSelectedRound(e.target.value)} value={selectedRound}>
          <option value="">Select Round</option>
          {rounds.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <input type="file" accept=".xlsx" onChange={handleFileUpload} className="p-2 border rounded w-full" />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Questions Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Text</th>
                <th className="p-2 border">A</th>
                <th className="p-2 border">B</th>
                <th className="p-2 border">C</th>
                <th className="p-2 border">D</th>
                <th className="p-2 border">Correct</th>
                <th className="p-2 border">Year</th>
                <th className="p-2 border">Topic ID</th>
                <th className="p-2 border">Round ID</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 border">{q.questionTitle}</td>
                  <td className="p-2 border">{q.questionText}</td>
                  <td className="p-2 border">{q.answerA}</td>
                  <td className="p-2 border">{q.answerB}</td>
                  <td className="p-2 border">{q.answerC}</td>
                  <td className="p-2 border">{q.answerD}</td>
                  <td className="p-2 border">{q.answerCorrect}</td>
                  <td className="p-2 border">{q.questionYear}</td>
                  <td className="p-2 border">{q.topicId}</td>
                  <td className="p-2 border">{q.roundId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
