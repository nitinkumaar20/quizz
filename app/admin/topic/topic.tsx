"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useGlobalDataStore } from "../../stores/globalDataStores";
import { TopicType } from "../../stores/globalDataStores";
import { TablePagination } from "@/app/components/Table";

export default function TopicManager() {
  const {
    examBoards,
    subjects,
    topics,
    fetchTopics,
    fetchSubjects,
    fetchExamBoards,
    addTopic,
    selectedExam,
    setSelectedExam,
    selectedBoard,
    setSelectedBoard,
    isEditModalOpen,
    setIsEditModalOpen,
    updateTopic,
  } = useGlobalDataStore();

  const [formData, setFormData] = useState<TopicType>({
    topicName: "",
    subjectId: null,
    active: true,
  });

  const [editingTopicId, setEditingTopicId] = useState<string | undefined>(
    undefined
  );

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  useEffect(() => {
    if (topics.length === 0) fetchTopics();
    if (subjects.length === 0) fetchSubjects();
    if (examBoards.length === 0) fetchExamBoards();
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

  const handleEditTopic = (topicId: string | undefined) => {
    if (!topicId) return;
    const topic = topics.find((t) => Number(t.id) === Number(topicId));
    if (!topic) return;

    const subject = subjects.find((s) => Number(s.id) === topic.subjectId);
    const examBoard = examBoards.find((eb) => eb.id === subject?.examId);

    setFormData({
      topicName: topic.topicName,
      subjectId: topic.subjectId,
      active: topic.active,
    });

    if (examBoard) {
      setSelectedBoard(examBoard.examBoardShortName);
      setSelectedExam(examBoard.examName);
    }

    setSelectedSubject(topic.subjectId);
    setEditingTopicId(topicId);

    setIsEditModalOpen(true);
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
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
      let res;
      if (editingTopicId) {
        // Edit existing topic
        res = await axios.put(
          `${process.env.NEXT_PUBLIC_TOPICS_API_KEY}/${editingTopicId}`,
          submitData
        );
        Swal.fire("Success", "Topic updated successfully", "success");
      } else {
        // Create new topic
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_TOPICS_API_KEY}`,
          submitData
        );
        Swal.fire("Success", "Topic created successfully", "success");

        if (res.data.data && res.data.data.length > 0) {
          addTopic(res.data.data[0]);
        }
      }

      // Reset form and state
      setFormData({ topicName: "", subjectId: null, active: true });
      setSelectedSubject(null);
      setSelectedBoard("");
      setSelectedExam("");
      setEditingTopicId(undefined);
      if (res.data.data && res.data.data.length > 0) {
        updateTopic(res.data.data[0]);
      }
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      console.error("Error submitting topic:", err);
      Swal.fire("Error", "Failed to submit topic", "error");
    }
  };

  return (
    <div className="mx-10">
      <h1 className="text-2xl font-bold mb-4">Add New Topic</h1>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Topic</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="topicName"
                placeholder="Topic Name"
                value={formData.topicName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <select
                value={selectedBoard}
                onChange={(e) => {
                  setSelectedBoard(e.target.value);
                  setSelectedExam(""); // reset exam
                  setSelectedSubject(null); // reset subject
                }}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Board</option>
                {[
                  ...new Set(examBoards.map((eb) => eb.examBoardShortName)),
                ].map((board, i) => (
                  <option key={i} value={board}>
                    {board.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value);
                  setSelectedSubject(null); // reset subject
                }}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Exam</option>
                {examBoards
                  .filter((eb) => eb.examBoardShortName === selectedBoard)
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
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => {
                  const examBoard = examBoards.find(
                    (eb) => Number(eb.id) === subject.examId
                  );
                  if (examBoard?.examName !== selectedExam) return null;
                  return (
                    <option key={subject.id} value={subject.id}>
                      {subject.subjectName.toUpperCase()}
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

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopicSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleTopicSubmit} className="space-y-3 max-w-md">
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
              handleEdit={handleEditTopic}
            />
          </div>
        ) : (
          <p>No topics found.</p>
        )}
      </div>
    </div>
  );
}
