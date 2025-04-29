"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Question {
  id?: string;
  questionText: string;
  questionTitle: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  answerCorrect: string;
  topicId: number | null;
  roundId: number | null;
  active: boolean;
  questionYear: string;
}

interface Round {
  id: number;
  roundName: string;
  sectionName: string;
  roundType: string;
  examId: number;
  ownerId: number;
  accessType: "PUBLIC" | "PRIVATE";
  active: boolean;
}

interface Topic {
  id: number;
  topicName: string;
  subjectId: number;
  active: boolean;
}

export default function QuestionManager() {
  const [selectedBoard, setselectedBoard] = useState("");
  const [selectedExamName, setselectedExamName] = useState("");
  const [selectedSubject, setselectedSubject] = useState("");
  const [examBoards, setExamBoards] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [formData, setFormData] = useState<Question>({
    questionText: "",
    questionTitle: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    answerCorrect: "A",
    topicId: null,
    roundId: null,
    active: true,
    questionYear: "",
  });

  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchQuestions();
    fetchRounds();
    fetchTopics();
  }, []);

  const fetchQuestions = async () => {
    try {
      const resQuestion = await axios.get("http://localhost:1100/api/question");
      const resBoard = await axios.get("http://localhost:1100/api/examboard");
      const resSubject = await axios.get("http://localhost:1100/api/subject");
      setQuestions(resQuestion.data.data);
      setExamBoards(resBoard.data.data);
      setSubjects(resSubject.data.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const fetchRounds = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/round");
      setRounds(res.data.data);
      console.log(res.data.data, "round");
    } catch (error) {
      console.error("Failed to fetch rounds", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/topic/");
      setTopics(res.data.data);
      console.log(res.data.data, "topic");
    } catch (error) {
      console.error("Failed to fetch topics", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["roundId", "topicId"].includes(name)
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));

    console.log(formData, "formData ques");
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.roundId === null || formData.topicId === null) {
      Swal.fire("Error", "Please select both Round and Topic", "error");
      return;
    }

    try {
      await axios.post("http://localhost:1100/api/question", formData);
      Swal.fire("Success", "Question added successfully", "success");
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error("Failed to add question", error);
      Swal.fire("Error", "Failed to add question", "error");
    }
  };

  const handleEdit = (question: Question) => {
    setFormData(question);
    setEditId(question.id);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;

    try {
      await axios.put(`http://localhost:1100/api/question/${editId}`, formData);
      Swal.fire("Updated!", "Question updated successfully.", "success");
      resetForm();
      setIsEditModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error("Failed to update question", error);
      Swal.fire("Error", "Failed to update question", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: "",
      questionTitle: "",
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      answerCorrect: "A",
      topicId: null,
      roundId: null,
      active: true,
      questionYear: "",
    });
    setEditId(undefined);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Questions</h1>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl space-y-4">
            <h2 className="text-xl font-bold mb-4">Edit Question</h2>

            <input
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              placeholder="Question Text"
              className="border p-2 w-full rounded"
            />
            <input
              name="questionTitle"
              value={formData.questionTitle}
              onChange={handleChange}
              placeholder="Question Title"
              className="border p-2 w-full rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                name="answerA"
                value={formData.answerA}
                onChange={handleChange}
                placeholder="Answer A"
                className="border p-2 rounded"
              />
              <input
                name="answerB"
                value={formData.answerB}
                onChange={handleChange}
                placeholder="Answer B"
                className="border p-2 rounded"
              />
              <input
                name="answerC"
                value={formData.answerC}
                onChange={handleChange}
                placeholder="Answer C"
                className="border p-2 rounded"
              />
              <input
                name="answerD"
                value={formData.answerD}
                onChange={handleChange}
                placeholder="Answer D"
                className="border p-2 rounded"
              />
            </div>

            <select
              name="answerCorrect"
              value={formData.answerCorrect}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="A">Answer A</option>
              <option value="B">Answer B</option>
              <option value="C">Answer C</option>
              <option value="D">Answer D</option>
            </select>

            <select
              name="topicId"
              value={formData.topicId ?? ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.topicName}
                </option>
              ))}
            </select>

            <select
              name="roundId"
              value={formData.roundId ?? ""}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select Round</option>
              {rounds.map((round) => (
                <option key={round.id} value={round.id}>
                  {round.roundName} - {round.sectionName}
                </option>
              ))}
            </select>

            <input
              name="questionYear"
              value={formData.questionYear}
              onChange={handleChange}
              placeholder="Question Year"
              className="border p-2 w-full rounded"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              Active
            </label>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Question Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-2xl bg-white p-6 rounded-lg shadow-md"
      >
        <input
          name="questionTitle"
          value={formData.questionTitle}
          onChange={handleChange}
          placeholder="Question Title"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="questionText"
          value={formData.questionText}
          onChange={handleChange}
          placeholder="Question Text"
          required
          className="w-full border p-2 rounded resize-none"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            name="answerA"
            value={formData.answerA}
            onChange={handleChange}
            placeholder="Answer A"
            className="border p-2 rounded"
          />
          <input
            name="answerB"
            value={formData.answerB}
            onChange={handleChange}
            placeholder="Answer B"
            className="border p-2 rounded"
          />
          <input
            name="answerC"
            value={formData.answerC}
            onChange={handleChange}
            placeholder="Answer C"
            className="border p-2 rounded"
          />
          <input
            name="answerD"
            value={formData.answerD}
            onChange={handleChange}
            placeholder="Answer D"
            className="border p-2 rounded"
          />
        </div>

        <select
          name="answerCorrect"
          value={formData.answerCorrect}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Correct Answer</option>
          <option value="A">Answer A</option>
          <option value="B">Answer B</option>
          <option value="C">Answer C</option>
          <option value="D">Answer D</option>
        </select>

        <select
          value={selectedBoard}
          onChange={(e) => setselectedBoard(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Board</option>
          {[...new Set(examBoards.map((eb) => eb.examBoardShortName))].map(
            (board, i) => (
              <option key={i} value={board}>
                {board.toUpperCase()}
              </option>
            )
          )}
        </select>

        <select
          value={selectedExamName}
          onChange={(e) => setselectedExamName(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Exam</option>
          {examBoards
            .filter(
              (eb) =>
                eb.examBoardShortName.toLowerCase() ===
                selectedBoard.toLowerCase()
            )
            .map((exam, i) => (
              <option key={i} value={exam.examName}>
                {exam.examName.toUpperCase()}
              </option>
            ))}
        </select>
        <select
          value={selectedSubject || ""}
          onChange={(e) => setselectedSubject(e.target.value)}
          onBlur={(e) => setselectedSubject(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => {
            const label = subject.subjectName.toUpperCase();
            const examBoard = examBoards.find((eb) => eb.id === subject.examId);
            if (
              examBoard?.examName.toLowerCase() !==
              selectedExamName.toLowerCase()
            )
              return null; // Filter subjects based on selected exam

            return (
              <option key={subject.id} value={subject.id}>
                {label}
              </option>
            );
          })}
        </select>

        <select
          name="topicId"
          value={formData.topicId ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select topic</option>
          {topics.map((topic) => {
            const label = topic.topicName.toUpperCase();
            const subject = subjects.find((s) => s.id === topic.subjectId);
            if (subject?.id !== Number(selectedSubject)) return null; // Filter topics based on selected subject

            return (
              <option key={topic.id} value={subject.id}>
                {label}
              </option>
            );
          })}
        </select>

        <select
          name="roundId"
          value={formData.roundId ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Round</option>
          {rounds.map((round) => {
            const label = round.roundName.toUpperCase();
            const Exams = examBoards.find((eb) => eb.id === round.examId);
            if (
              Exams?.examName.toLowerCase() !== selectedExamName.toLowerCase()
            )
              return null;

            return (
              <option key={round.id} value={Exams.id}>
                {label}
              </option>
            );
          })}
        </select>

        <input
          name="questionYear"
          value={formData.questionYear}
          onChange={handleChange}
          placeholder="Question Year"
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          Active
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Question
        </button>
      </form>

      {/* Question Table */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">All Questions</h2>
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Question</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Year</th>
                <th className="p-2 border">Topic</th>
                <th className="p-2 border">Round</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{q.questionText}</td>
                  <td className="p-2 border">{q.questionTitle}</td>
                  <td className="p-2 border">{q.questionYear}</td>
                  <td className="p-2 border">
                    {topics.find((t) => t.id === q.topicId)?.topicName || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {rounds.find((r) => r.id === q.roundId)?.roundName || "N/A"}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
