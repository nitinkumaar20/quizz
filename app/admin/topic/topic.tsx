"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Topic {
  id?: string;
  topicName: string;
  subjectId: number | null;
  active: boolean;
}

interface Subject {
  id: number;
  subjectName: string;
  examId: number;
}

interface ExamBoard {
    id: number;
    examId: number; // 👈 add this line
    examBoardShortName: string;
    examName: string;
    // you can include others if needed
  }
  

export default function TopicManager() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [formData, setFormData] = useState<Topic>({
    topicName: "",
    subjectId: null,
    active: true,
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  useEffect(() => {
    fetchTopics();
    fetchSubjects();
    fetchExamBoards();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/topic");
      setTopics(res.data.data);
    } catch (err) {
      console.error("Failed to fetch topics", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/subject");
      setSubjects(res.data.data);
      console.log("Subjects fetched:", res.data.data);
      
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  const fetchExamBoards = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/examboard");
      setExamBoards(res.data.data);
    } catch (err) {
      console.error("Failed to fetch exam boards", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubject) {
      Swal.fire("Error", "Please select a subject", "error");
      return;
    }

    const submitData = {
      ...formData,
      subjectId: selectedSubject,
    };

    try {
      await axios.post("http://localhost:1100/api/topic", submitData);
      Swal.fire("Success", "Topic created successfully", "success");
      setFormData({ topicName: "", subjectId: null, active: true });
      setSelectedSubject(null);
      fetchTopics();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Error submitting topic:", err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
      }
      Swal.fire("Error", "Failed to submit topic", "error");
    }
  };

  // Filter subjects based on selected exam and board
  const filteredSubjects = subjects.filter((subject) => {
    const examBoard = examBoards.find((eb) => eb.id === subject.examId);
    return (
      examBoard?.examName === selectedExam &&
      examBoard?.examBoardShortName === selectedBoard
    );
  });


  return (
    <div className="mx-10">
      <h1 className="text-2xl font-bold mb-4">Add New Topic</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input
          type="text"
          name="topicName"
          placeholder="Topic Name"
          value={formData.topicName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Exam</option>
          {[...new Set(examBoards.map((eb) => eb.examName))].map((exam, i) => (
            <option key={i} value={exam}>
              {exam.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="w-full border p-2 rounded"
          required
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
  value={selectedSubject || ""}
  onChange={(e) => setSelectedSubject(Number(e.target.value))}
  className="w-full border p-2 rounded"
  required
>
  <option value="">Select Subject</option>
  {subjects.map((subject) => {

    
    const label = `${subject.subjectName.toUpperCase()} ${subject.examId}   `;
    
    return (
      <option key={subject.id} value={subject.id}>
        {label}
      </option>
    );
  })}
</select>



        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <span>Is Active?</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Topic
        </button>
      </form>

      {/* Table of Topics */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">All Topics</h2>
        {topics.length > 0 ? (
          <div className="w-full border rounded bg-white">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Topic</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Exam</th>
                  <th className="p-2 border">Board</th>
                  <th className="p-2 border">Active</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic, i) => {
                  const subject = subjects.find((s) => s.id === topic.subjectId);
                  const examBoard = examBoards.find(
                    (eb) => eb.id === subject?.examId
                  );

                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border">{topic.topicName}</td>
                      <td className="p-2 border">{subject?.subjectName || "N/A"}</td>
                      <td className="p-2 border">{examBoard?.examName || "N/A"}</td>
                      <td className="p-2 border">
                        {examBoard?.examBoardShortName || "N/A"}
                      </td>
                      <td className="p-2 border">{topic.active ? "Yes" : "No"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No topics found.</p>
        )}
      </div>
    </div>
  );
}
