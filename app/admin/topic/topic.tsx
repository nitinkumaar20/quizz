"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useGlobalDataStore } from "../../stores/globalDataStores";
import { TopicType } from "../../stores/globalDataStores";
import { TablePagination} from "@/app/components/Table";

export default function TopicManager() {
  const {
    examBoards,
    subjects,
    topics,
    fetchTopics,
    fetchSubjects,
    fetchExamBoards,
  } = useGlobalDataStore();

  const [formData, setFormData] = useState<TopicType>({
    topicName: "",
    subjectId: null,
    active: true,
  });

  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  useEffect(() => {
    fetchTopics();
    fetchSubjects();
    fetchExamBoards();
  }, []);

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
      await axios.post(
        `${process.env.NEXT_PUBLIC_TOPICS_API_KEY} `,
        submitData
      );
      Swal.fire("Success", "Topic created successfully", "success");
      setFormData({ topicName: "", subjectId: null, active: true });
      setSelectedSubject(null);
      fetchTopics();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error submitting topic:",
          err.response?.data || err.message
        );
      } else {
        console.error("Unexpected error:", err);
      }
      Swal.fire("Error", "Failed to submit topic", "error");
    }
  };

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
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full border p-2 rounded"
          required
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
          onChange={(e) => setSelectedSubject(Number(e.target.value))}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => {
            const label = subject.subjectName.toUpperCase();
            const examBoard = examBoards.find(
              (eb) => Number(eb.id) === subject.examId
            );
            if (
              examBoard?.examName.toLowerCase() !== selectedExam.toLowerCase()
            )
              return null; // Filter subjects based on selected exam

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
            <TablePagination
              topics={topics}
              subjects={subjects}
              examBoards={examBoards}
              component="topic"
              handleEdit={() => {}}
            />
          </div>
        ) : (
          <p>No topics found.</p>
        )}
      </div>
    </div>
  );
}
