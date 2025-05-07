"use client";

import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalDataStore } from "../../stores/globalDataStores";
import { RoundType } from "../../stores/globalDataStores";
import { TablePagination} from "@/app/components/Table";

export default function Round() {
  const { rounds, fetchRounds, examBoards, fetchExamBoards } =
    useGlobalDataStore();

  const [formData, setFormData] = useState<RoundType>({
    roundName: "",
    sectionName: "",
    examId: null,
    ownerId: null,
    active: false,
    roundType: "PRELIMS",
    accessType: "PUBLIC",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);

  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [editExamName, setEditExamName] = useState<string>("");
  const [editBoardShortName, setEditBoardShortName] = useState<string>("");

  useEffect(() => {
    fetchRounds();
    fetchExamBoards();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["examId", "ownerId"].includes(name)
          ? value === ""
            ? null // Store null for empty input
            : Number(value) // Convert to number if not empty
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const matchedExamBoard = examBoards.find(
      (eb) =>
        eb.examName.toLowerCase() === selectedExam.toLowerCase() &&
        eb.examBoardShortName === selectedBoard
    );

    if (!matchedExamBoard) {
      Swal.fire("Error", "Matching Exam and Board not found", "error");
      return;
    }

    const submitData = {
      roundName: formData.roundName,
      sectionName: formData.sectionName,
      active: formData.active,
      roundType: formData.roundType,
      accessType: formData.accessType,
      examId: matchedExamBoard.id,
      ownerId: 1, // Replace with actual user ID if needed
    };
    console.log(submitData, "submitData");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_ROUNDS_API_KEY} `,
        submitData
      );
      Swal.fire("Success", "Round created successfully", "success");
      setFormData({
        roundName: "",
        sectionName: "",
        examId: null,
        ownerId: null,
        active: false,
        roundType: "PRELIMS",
        accessType: "PUBLIC",
      });
      setSelectedExam("");
      setSelectedBoard("");
      fetchRounds();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error submitting subject:",
          err.response?.data || err.message
        );
      } else {
        console.error("Unexpected error:", err);
      }
      Swal.fire("Error", "Failed to submit subject", "error");
    }
  };

  const handleEdit = (id: string | undefined) => {
    const subjectToEdit = rounds.find((s) => s.id === id);
    if (subjectToEdit) {
      setFormData(subjectToEdit);
      setEditId(id);

      const matchingBoard = examBoards.find(
        (eb) => Number(eb.id) === subjectToEdit.examId
      );
      setEditExamName(matchingBoard?.examName || "");
      setEditBoardShortName(matchingBoard?.examBoardShortName || "");

      setIsEditModalOpen(true);
    }
  };
  const handleSaveEdit = async () => {
    if (!editId) return;

    const matchedExamBoard = examBoards.find(
      (eb) =>
        eb.examName === editExamName &&
        eb.examBoardShortName === editBoardShortName
    );

    if (!matchedExamBoard) {
      Swal.fire("Error", "Matching Exam and Board not found", "error");
      return;
    }

    const updateData = {
      roundName: formData.roundName,
      sectionName: formData.sectionName,
      active: formData.active,
      examId: matchedExamBoard.id,
      ownerId: 1,
      roundType: formData.roundType,
      accessType: formData.accessType,
    };
    console.log(updateData, "updateData");

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_ROUNDS_API_KEY}/${editId}`, // corrected URL
        updateData
      );
      Swal.fire("Updated!", "Round updated successfully.", "success");

      setIsEditModalOpen(false);
      setEditId(undefined);
      setFormData({
        roundName: "",
        sectionName: "",
        examId: null,
        ownerId: null,
        active: false,
        roundType: "PRELIMS",
        accessType: "PUBLIC",
      });
      setEditExamName("");
      setEditBoardShortName("");
      fetchRounds();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("PUT error:", error.response?.data || error.message);
        Swal.fire(
          "Error",
          error.response?.data?.message?.[0]?.message ||
            "Failed to update round",
          "error"
        );
      } else {
        console.error("Unexpected error:", error);
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
    }
  };

  return (
    <div className="overflow-auto w-full my-5">
      <h1 className="text-2xl font-bold mb-4 mx-10">Add New Round</h1>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Round</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="roundName"
                placeholder="Round Name"
                value={formData.roundName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="sectionName"
                placeholder="Section Name"
                value={formData.sectionName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <select
                value={editBoardShortName}
                onChange={(e) => setEditBoardShortName(e.target.value)}
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
                value={editExamName}
                onChange={(e) => setEditExamName(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Exam</option>
                {examBoards
                  .filter(
                    (eb) =>
                      eb.examBoardShortName.toLowerCase() ===
                      editBoardShortName.toLowerCase()
                  )
                  .map((exam, i) => (
                    <option key={i} value={exam.examName}>
                      {exam.examName.toUpperCase()}
                    </option>
                  ))}
              </select>

              <select
                name="roundType"
                value={formData.roundType}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="MAIN">MAIN</option>
                <option value="PRELIMS">PRELIMS</option>
              </select>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
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
                  onClick={handleSaveEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 max-w-md mx-10 flex flex-col justify-start items-start"
      >
        <input
          type="text"
          name="roundName"
          placeholder="Round Name"
          value={formData.roundName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="sectionName"
          placeholder="Section Name"
          value={formData.sectionName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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
          name="roundType"
          value={formData.roundType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="MAIN">MAIN</option>
          <option value="PRELIMS">PRELIMS</option>
        </select>

        <select
          name="accessType"
          value={formData.accessType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="PRIVATE">PRIVATE</option>
          <option value="PUBLIC">PUBLIC</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
          />
          <span>Is Active?</span>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Subject
        </button>
      </form>

      {/* Table */}
      <div className="mt-8 mx-10 ">
        <h2 className="text-xl font-semibold mb-2">All Rounds</h2>
        {rounds.length > 0 ? (
          <div className="w-full border rounded bg-white">
            <TablePagination
              examBoards={examBoards}
              rounds={rounds}
              component="round"
              handleEdit={handleEdit}
            />
          </div>
        ) : (
          <p>No subjects found.</p>
        )}
      </div>
    </div>
  );
}
